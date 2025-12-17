"use server";
import mongoose, { Types } from "mongoose";
import Order from "@/models/order";
import CompanyInvoice from "@/models/company-invoice";
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";

export async function completeOrderWithInvoice(
  orderId: string
  // signature: string
) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find order
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found.");

    order.status = "accepted";
    // order.signature = signature; // <-- SAVE SIGNATURE IMAGE
    await order.save({ session });

    const now = new Date();
    const THIRTY_ONE_DAYS = 31 * 24 * 60 * 60 * 1000;

    // 2. Look for existing pending invoice (<=31 days)
    let invoice = await CompanyInvoice.findOne({
      companyId: order.companyId,
      status: "pending",
      createdAt: { $gte: new Date(now.getTime() - THIRTY_ONE_DAYS) },
    }).session(session);

    // 3. If no invoice → create a new one and set opening balance
    if (!invoice) {
      const company = await Company.findById(order.companyId).session(session);
      if (!company) throw new Error("Company not found");

      // Sum usedCredit across mines
      const creditAgg = await CompanyCredit.aggregate([
        { $match: { companyId: company._id } },
        { $group: { _id: null, usedCreditTotal: { $sum: "$usedCredit" } } },
      ]).session(session);

      const usedCredit =
        creditAgg.length > 0 ? creditAgg[0].usedCreditTotal : 0;

      const openingBalance = (company.usedDebit || 0) + usedCredit;

      const created = await CompanyInvoice.create(
        [
          {
            companyId: company._id,
            status: "pending",
            totalAmount: 0,
            openingBalance,
          },
        ],
        { session }
      );

      invoice = created[0];
    }

    // 4. Attach order to invoice
    order.invoiceId = invoice._id;
    order.status = "completed";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, invoiceId: invoice._id };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: error.message };
  }
}

/**
 * Get all invoices
 */
export async function getCompanyInvoicesService() {
  await connectDB();

  try {
    const invoices = await CompanyInvoice.find()
      .populate("companyId", "companyName")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("❌ getCompanyInvoicesService error:", error);
    return [];
  }
}

/**
 * Get invoices by company
 */
export async function getCompanyInvoicesByCompanyIdService(companyId: string) {
  await connectDB();

  try {
    const invoices = await CompanyInvoice.find({
      companyId: new Types.ObjectId(companyId),
    })
      .populate("companyId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("❌ getCompanyInvoicesService error:", error);
    return [];
  }
}

/**
 * Get invoice by ID
 */
export async function getCompanyInvoiceByIdService(id: string) {
  await connectDB();

  try {
    const invoice = await CompanyInvoice.findById(id)
      .populate("companyId", "companyName")
      .lean();

    return invoice ? JSON.parse(JSON.stringify(invoice)) : null;
  } catch (error) {
    console.error("❌ getCompanyInvoiceByIdService error:", error);
    return null;
  }
}

/**
 * CompanyInvoice fields:
 * companyId: string
 * status: "pending" | "published" | "paid" | "closed"
 * totalAmount: number
 * paymentDate?: Date
 */

// ---------------- PUBLISH INVOICE ----------------
export async function publishInvoiceService(invoiceId: string) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await CompanyInvoice.findById(invoiceId).session(session);

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found" };
    }

    if (invoice.status !== "pending") {
      await session.abortTransaction();
      return { success: false, message: "Invoice cannot be published" };
    }

    const orders = await Order.find({ invoiceId }).session(session);
    if (orders.length === 0) {
      await session.abortTransaction();
      return { success: false, message: "No orders found for invoice" };
    }

    // 1. Calculate total amount
    const totalAmount = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    // 2. Calculate closing balance
    const openingBalance = invoice.openingBalance || 0;
    const closingBalance = openingBalance + totalAmount;

    // 3. Update invoice
    invoice.totalAmount = totalAmount;
    invoice.closingBalance = closingBalance;
    invoice.status = "published";

    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, totalAmount, closingBalance };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: error.message };
  }
}

export async function confirmInvoicePaymentService(
  invoiceId: string,
  data: { amount: number; paymentDate: Date }
) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ------------------ FETCH INVOICE ------------------ */
    const invoice = await CompanyInvoice.findById(invoiceId)
      .session(session)
      .exec();

    if (!invoice) throw new Error("Invoice not found.");

    if (!["published", "partially_paid"].includes(invoice.status)) {
      throw new Error("Invoice cannot receive payments.");
    }

    /* ------------------ FETCH COMPANY ------------------ */
    const company = await Company.findById(invoice.companyId)
      .session(session)
      .exec();

    if (!company) throw new Error("Company not found.");

    /* ------------------ FETCH COMPANY CREDITS ------------------ */
    const credits = await CompanyCredit.find({
      companyId: company._id,
      usedCredit: { $gt: 0 },
    })
      .sort({ createdAt: 1 }) // FIFO
      .session(session);

    const cashPayment = Number(data.amount) || 0;

    /* ------------------ OPENING BALANCE ------------------ */
    const openingBalance = invoice.closingBalance ?? invoice.totalAmount;

    if (openingBalance <= 0) {
      throw new Error("Invoice is already settled.");
    }

    /* =====================================================
       DETERMINE SETTLEMENT AMOUNT
    ===================================================== */
    let remainingToSettle =
      cashPayment === 0
        ? openingBalance // debit settlement
        : Math.min(cashPayment, openingBalance);

    let settledFromDebit = 0;

    /* =====================================================
       1️⃣ SETTLE USING COMPANY DEBIT FIRST
    ===================================================== */
    if (company.debitAmount > 0 && remainingToSettle > 0) {
      settledFromDebit = Math.min(company.debitAmount, remainingToSettle);

      company.debitAmount -= settledFromDebit;
      remainingToSettle -= settledFromDebit;
    }

    /* =====================================================
       2️⃣ SETTLE COMPANY CREDIT (FIFO)
    ===================================================== */
    for (const credit of credits) {
      if (remainingToSettle <= 0) break;

      const deduction = Math.min(credit.usedCredit, remainingToSettle);

      credit.usedCredit -= deduction;
      remainingToSettle -= deduction;

      await credit.save({ session });
    }

    /* =====================================================
       3️⃣ EXCESS CASH → COMPANY DEBIT
    ===================================================== */
    if (cashPayment > openingBalance) {
      const excess = cashPayment - openingBalance;
      company.debitAmount = (company.debitAmount || 0) + excess;
    }

    /* =====================================================
       CALCULATE TOTAL SETTLED
    ===================================================== */
    const settledAmount = openingBalance - remainingToSettle;

    if (settledAmount <= 0) {
      throw new Error("No settlement was applied.");
    }

    /* ------------------ UPDATE INVOICE ------------------ */
    invoice.paymentAmount = (invoice.paymentAmount || 0) + settledAmount;

    invoice.paymentDate = data.paymentDate.toISOString();

    invoice.closingBalance = Math.max(openingBalance - settledAmount, 0);

    invoice.status = "paid";

    await invoice.save({ session });
    await company.save({ session });

    /* =====================================================
       4️⃣ MARK ORDERS AS PAID (ONLY IF FULLY SETTLED)
    ===================================================== */
    if (invoice.status === "paid") {
      await Order.updateMany(
        { invoiceId: invoice._id },
        {
          $set: {
            status: "paid",
          },
        },
        { session }
      );
    }

    /* ------------------ STATEMENT TRAIL ------------------ */
    await AccountStatementTrail.create(
      [
        {
          companyId: company._id,
          invoiceId: invoice._id,
          type: "invoice-payment",
          amount: settledAmount,
          oldBalance: openingBalance,
          newBalance: invoice.closingBalance,
          description:
            cashPayment === 0
              ? `Invoice settled using debit`
              : `Payment for Invoice #${invoice._id}`,
          createdAt: new Date(),
        },
      ],
      { session }
    );

    /* ------------------ COMMIT ------------------ */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      status: invoice.status,
      openingBalance,
      settledAmount,
      closingBalance: invoice.closingBalance,
    };
  } catch (error: any) {
    console.error("❌ confirmInvoicePaymentService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: error.message };
  }
}

// ---------------- CLOSE INVOICE ----------------
export async function closeInvoiceService(invoiceId: string) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invoice = await CompanyInvoice.findById(invoiceId).session(session);

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found." };
    }

    if (invoice.status !== "paid") {
      await session.abortTransaction();
      return { success: false, message: "Invoice must be paid first." };
    }

    // Mark invoice closed
    invoice.status = "closed";
    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error("❌ closeInvoiceService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: "Failed to close invoice." };
  }
}
