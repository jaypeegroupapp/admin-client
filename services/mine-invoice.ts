"use server";
import mongoose, { Types } from "mongoose";
import Order from "@/models/order";
import MineInvoice from "@/models/mine-invoice";
import { connectDB } from "@/lib/db";
import AccountStatementTrail from "@/models/account-statement-trail";
import Company from "@/models/company";
import CompanyCredit from "@/models/company-credit";

export async function completeMineOrderWithInvoice(
  orderId: string
  // signature: string
) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* =========================================
       1️⃣ FIND ORDER
    ========================================= */
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found.");

    order.status = "accepted";
    await order.save({ session });

    /* =========================================
       2️⃣ FIND EXISTING PENDING INVOICE (≤ 31 DAYS)
    ========================================= */
    const now = new Date();
    const THIRTY_ONE_DAYS = 31 * 24 * 60 * 60 * 1000;

    let invoice = await MineInvoice.findOne({
      companyId: order.companyId,
      mineId: order.mineId,
      status: "pending",
      createdAt: { $gte: new Date(now.getTime() - THIRTY_ONE_DAYS) },
    }).session(session);

    /* =========================================
       3️⃣ IF NO INVOICE → CREATE NEW ONE
       OPENING BALANCE = LAST INVOICE CLOSING BALANCE
    ========================================= */
    if (!invoice) {
      const company = await Company.findById(order.companyId).session(session);
      if (!company) throw new Error("Company not found");

      // 🔑 Get last invoice (excluding pending)
      const lastInvoice = await MineInvoice.findOne({
        companyId: company._id,
        mineId: order.mineId,
        status: { $in: ["published", "paid", "closed"] },
      })
        .sort({ createdAt: -1 })
        .session(session);

      const openingBalance = lastInvoice?.closingBalance || 0;

      const created = await MineInvoice.create(
        [
          {
            companyId: company._id,
            mineId: order.mineId,
            status: "pending",
            openingBalance,
            totalAmount: 0,
            closingBalance: openingBalance,
          },
        ],
        { session }
      );

      invoice = created[0];
    }

    /* =========================================
       4️⃣ ATTACH ORDER TO INVOICE
    ========================================= */
    order.invoiceId = invoice._id;
    order.status = "completed";
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      invoiceId: invoice._id,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ completeOrderWithInvoice error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Get all invoices
 */
export async function getMineInvoicesService() {
  await connectDB();

  try {
    const invoices = await MineInvoice.find()
      .populate("companyId", "name")
      .populate("mineId", "name")
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
    const invoices = await MineInvoice.find({
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
export async function getMineInvoiceByIdService(id: string) {
  await connectDB();

  try {
    const invoice = await MineInvoice.findById(id)
      .populate("companyId", "name")
      .lean();

    return invoice ? JSON.parse(JSON.stringify(invoice)) : null;
  } catch (error) {
    console.error("❌ getCompanyInvoiceByIdService error:", error);
    return null;
  }
}

/**
 * MineInvoice fields:
 * companyId: string
 * status: "pending" | "published" | "paid" | "closed"
 * totalAmount: number
 * paymentDate?: Date
 */

// ---------------- PUBLISH INVOICE ----------------
export async function publishMineInvoiceService(invoiceId: string) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invoice = await MineInvoice.findById(invoiceId).session(session);

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

    /* =====================================================
       1️⃣ FETCH INVOICE
    ===================================================== */
    const invoice = await MineInvoice.findById(invoiceId)
      .session(session)
      .exec();

    if (!invoice) throw new Error("Invoice not found.");

    if (invoice.status !== "published") {
      throw new Error("Only published invoices can be paid.");
    }

    const openingBalance = invoice.closingBalance ?? 0;

    if (openingBalance <= 0) {
      throw new Error("Invoice is already settled.");
    }

    /* =====================================================
       2️⃣ FETCH COMPANY
    ===================================================== */
    const company = await Company.findById(invoice.companyId)
      .session(session)
      .exec();

    if (!company) throw new Error("Company not found.");

    const paymentAmount = Number(data.amount || 0);

    /* =====================================================
       3️⃣ RESET ALL COMPANY CREDIT (CLEAR USED CREDIT)
    ===================================================== */
    const credit = await CompanyCredit.findOne({
      companyId: company._id,
      mineId: invoice.mineId,
    })
      .session(session)
      .exec();

    if (!credit) throw new Error("Company credit not found.");

    if (credit.usedCredit > 0) {
      const balance = credit.usedCredit - paymentAmount;

      if (balance <= 0) {
        credit.usedCredit = 0;
        credit.status = "settled";
      } else {
        credit.usedCredit = balance;
        credit.status = "owing";
      }

      await credit.save({ session });
    } else {
      throw new Error("Company credit is already settled.");
    }

    /* =====================================================
       4️⃣ CALCULATE EXCESS PAYMENT → DEBIT BALANCE
    ===================================================== */
    const excessPayment = Math.max(paymentAmount - openingBalance, 0);

    const oldDebitBalance = company.debitAmount || 0;

    if (excessPayment > 0) {
      company.debitAmount = oldDebitBalance + excessPayment;
      await company.save({ session });
    }

    /* =====================================================
       5️⃣ UPDATE INVOICE
    ===================================================== */
    invoice.paymentAmount = paymentAmount;
    invoice.paymentDate = new Date(data.paymentDate);
    invoice.closingBalance =
      invoice.totalAmount + invoice.openingBalance - paymentAmount;
    invoice.status = "paid";

    await invoice.save({ session });

    /* =====================================================
       6️⃣ ACCOUNT STATEMENT TRAIL
    ===================================================== */
    await AccountStatementTrail.create(
      [
        {
          companyId: company._id,
          type: "invoice-payment",
          amount: paymentAmount,
          oldBalance: openingBalance,
          newBalance: 0,
          description: `Invoice ${invoice._id.toString()} fully settled`,
        },
      ],
      { session }
    );

    /* =====================================================
       7️⃣ COMMIT
    ===================================================== */
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      invoiceId: invoice._id,
      status: invoice.status,
      openingBalance,
      paymentAmount,
      excessAddedToDebit: excessPayment,
      newDebitBalance: company.debitAmount,
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("❌ confirmInvoicePaymentService error:", error);

    return {
      success: false,
      message: error.message || "Failed to confirm invoice payment.",
    };
  }
}

// ---------------- CLOSE INVOICE ----------------
export async function closeInvoiceService(invoiceId: string) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invoice = await MineInvoice.findById(invoiceId).session(session);

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
