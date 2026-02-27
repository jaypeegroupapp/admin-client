"use server";
// data/services/supplier-invoice.service.ts

import { connectDB } from "@/lib/db";
import SupplierInvoice from "@/models/supplier-invoice";
import mongoose, { Types } from "mongoose";

// CREATE
export async function createSupplierInvoiceService(data: {
  name: string;
  invoiceNumber: string;
  invoiceUnitPrice: number;
  discount: number;
  invoiceDate: string;
  stockMovementId: string;
}) {
  await connectDB();

  return await SupplierInvoice.create({
    name: data.name,
    invoiceNumber: data.invoiceNumber,
    invoiceUnitPrice: data.invoiceUnitPrice,
    discount: data.discount,
    invoiceDate: new Date(data.invoiceDate),
    stockMovementId: new Types.ObjectId(data.stockMovementId),
  });
}

// GET ALL
export async function getSupplierInvoicesService() {
  await connectDB();
  return await SupplierInvoice.find()
    .populate({
      path: "stockMovementId",
      select: "quantity purchasePrice type createdAt",
      populate: {
        path: "productId",
        select: "name",
      },
    })
    .sort({ createdAt: -1 })
    .lean();
}

// GET ONE
export async function getSupplierInvoiceByIdService(id: string) {
  await connectDB();
  return await SupplierInvoice.findById(id)
    .populate({
      path: "stockMovementId",
      select: "quantity purchasePrice type createdAt",
      populate: {
        path: "productId",
        select: "name",
      },
    })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getSupplierInvoiceByInvoiceNumberService(
  invoiceNumber: string,
) {
  await connectDB();
  return await SupplierInvoice.findOne({ invoiceNumber })
    .populate({
      path: "stockMovementId",
      select: "quantity purchasePrice type createdAt",
      populate: {
        path: "productId",
        select: "name",
      },
    })
    .sort({ createdAt: -1 })
    .lean();
}

// UPDATE
export async function updateSupplierInvoiceService(id: string, data: any) {
  await connectDB();

  return await SupplierInvoice.findByIdAndUpdate(
    id,
    {
      name: data.name,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: new Date(data.invoiceDate),
      stockMovementId: new Types.ObjectId(data.stockMovementId),
    },
    { new: true },
  ).lean();
}

// DELETE
export async function deleteSupplierInvoiceService(id: string) {
  await connectDB();

  return await SupplierInvoice.findByIdAndDelete(id).lean();
}

/* ------------------------------------------------------
 * CONFIRM PAYMENT (SERVICE)
 * ------------------------------------------------------ */
export async function confirmSupplierInvoicePaymentService(invoiceId: string) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invoice = (await SupplierInvoice.findById(invoiceId).session(
      session,
    )) as any;

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found." };
    }

    invoice.status = "paid";
    invoice.paymentDate = new Date();

    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error("❌ confirmSupplierInvoicePaymentService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: "Failed to confirm payment." };
  }
}

/* ------------------------------------------------------
 * CLOSE INVOICE (SERVICE)
 * ------------------------------------------------------ */
export async function closeSupplierInvoiceService(invoiceId: string) {
  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invoice = await SupplierInvoice.findById(invoiceId).session(session);

    if (!invoice) {
      await session.abortTransaction();
      return { success: false, message: "Invoice not found." };
    }

    if (invoice.status !== "paid") {
      await session.abortTransaction();
      return {
        success: false,
        message: "Invoice must be marked paid before closing.",
      };
    }

    invoice.status = "closed";

    await invoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error("❌ closeSupplierInvoiceService error:", error);
    await session.abortTransaction();
    session.endSession();
    return { success: false, message: "Failed to close invoice." };
  }
}
