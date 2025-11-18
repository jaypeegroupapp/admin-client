"use server";
import mongoose, { Types } from "mongoose";
import Order from "@/models/order";
import CompanyInvoice from "@/models/company-invoice";
import { connectDB } from "@/lib/db";

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

    // 4. Find existing invoice (pending only)
    let invoice = (await CompanyInvoice.findOne({
      companyId: order.companyId,
      status: "pending", // Only add orders to open invoice
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
      .populate("companyId", "name")
      .lean();

    return invoice ? JSON.parse(JSON.stringify(invoice)) : null;
  } catch (error) {
    console.error("❌ getCompanyInvoiceByIdService error:", error);
    return null;
  }
}
