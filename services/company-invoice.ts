"use server";
import mongoose, { Types } from "mongoose";
import Order from "@/models/order";
import CompanyInvoice from "@/models/company-invoice";
import { connectDB } from "@/lib/db";
import CompanyCreditTrail from "@/models/company-credit-trail";
import Company from "@/models/company";

export async function completeOrderWithInvoice(orderId: string) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Mark the order as accepted
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "accepted" },
      { new: true, session }
    );

    if (!order) throw new Error("Order not found.");

    // 4. Find an open invoice (pending AND within 31 days)
    const THIRTY_ONE_DAYS = 31 * 24 * 60 * 60 * 1000;
    const now = new Date();

    let invoice = (await CompanyInvoice.findOne({
      companyId: order.companyId,
      status: "pending",
      createdAt: {
        $gte: new Date(now.getTime() - THIRTY_ONE_DAYS), // invoice must be <= 31 days old
      },
    }).session(session)) as any;

    // 5. If no pending invoice exists → create one
    if (!invoice) {
      invoice = await CompanyInvoice.create(
        [
          {
            companyId: new Types.ObjectId(order.companyId),
            status: "pending", // REQUIRED CHANGE
            totalAmount: 0, // totalAmount updated only when published
          },
        ],
        { session }
      );
      invoice = invoice[0]; // extract document
    }

    // 6. Attach order to invoice
    order.invoiceId = invoice._id;
    order.status = "completed";
    await order.save({ session });

    // 7. DO NOT UPDATE totalAmount UNTIL PUBLISHED (your requirement)
    await session.commitTransaction();
    session.endSession();

    return { success: true, invoiceId: invoice._id };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("completeOrderWithInvoice error:", error);
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

  try {
    session.startTransaction();

    // 1️⃣ Fetch invoice
    const invoice = await CompanyInvoice.findById(invoiceId).session(session);

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found." };
    }

    if (invoice.status !== "pending") {
      await session.abortTransaction();
      return { success: false, message: "Invoice cannot be published." };
    }

    // 2️⃣ Fetch all orders linked to this invoice
    const orders = await Order.find({ invoiceId }).session(session);

    if (!orders.length) {
      await session.abortTransaction();
      return { success: false, message: "No orders linked to this invoice." };
    }

    // 3️⃣ Calculate total invoice amount
    const totalAmount = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // 4️⃣ Update invoice fields
    invoice.totalAmount = totalAmount;
    invoice.status = "published";

    await invoice.save({ session });

    // 5️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true, totalAmount };
  } catch (error) {
    console.error("❌ publishInvoiceService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: "Failed to publish invoice." };
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
    const invoice = (await CompanyInvoice.findById(invoiceId)
      .session(session)
      .exec()) as any;

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found." };
    }

    if (invoice.status !== "published") {
      await session.abortTransaction();
      return { success: false, message: "Invoice must be published first." };
    }

    /* ------------------ FETCH COMPANY ------------------ */
    const company = await Company.findById(invoice.companyId)
      .session(session)
      .exec();

    if (!company) {
      await session.abortTransaction();
      return { success: false, message: "Company not found." };
    }

    const oldBalance = company.balance ?? 0;
    const paymentAmount = data.amount;
    const newBalance = oldBalance + paymentAmount;

    /* ------------------ UPDATE INVOICE ------------------ */
    invoice.status = "paid";
    invoice.paymentDate = new Date(data.paymentDate);
    invoice.paymentAmount = paymentAmount;
    await invoice.save({ session });

    /* ------------------ UPDATE COMPANY BALANCE ------------------ */
    company.balance = newBalance;
    await company.save({ session });

    /* ------------------ CREATE CREDIT TRAIL ENTRY ------------------ */
    await CompanyCreditTrail.create(
      [
        {
          companyId: company._id,
          type: "invoice-payment",
          amount: paymentAmount,
          oldBalance,
          newBalance,
          description: `Payment for Invoice #${invoice._id}`,
          createdAt: new Date(),
        },
      ],
      { session }
    );

    /* ------------------ COMMIT ------------------ */
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error("❌ confirmInvoicePaymentService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: "Failed to confirm payment." };
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
