// data/services/supplier-invoice.service.ts

import { connectDB } from "@/lib/db";
import SupplierInvoice from "@/models/supplier-invoice";
import { Types } from "mongoose";

// CREATE
export async function createSupplierInvoiceService(data: {
  name: string;
  invoiceNumber: string;
  invoiceDate: string;
  stockMovementId: string;
}) {
  await connectDB();

  return await SupplierInvoice.create({
    name: data.name,
    invoiceNumber: data.invoiceNumber,
    invoiceDate: new Date(data.invoiceDate),
    stockMovementId: new Types.ObjectId(data.stockMovementId),
  });
}

// GET ALL
export async function getSupplierInvoicesService() {
  await connectDB();
  return await SupplierInvoice.find().sort({ createdAt: -1 }).lean();
}

// GET ONE
export async function getSupplierInvoiceByIdService(id: string) {
  await connectDB();
  return await SupplierInvoice.findById(id).lean();
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
    { new: true }
  ).lean();
}

// DELETE
export async function deleteSupplierInvoiceService(id: string) {
  await connectDB();

  return await SupplierInvoice.findByIdAndDelete(id).lean();
}
