"use server";
// data/supplier-invoice.ts
import {
  getSupplierInvoicesService,
  getSupplierInvoiceByIdService,
} from "@/services/supplier-invoice";

function supplierInvoiceMap(invoice: any) {
  return {
    id: invoice._id?.toString() || "",
    name: invoice.name || "",
    status: invoice.status || "pending",
    paymentDate: invoice.paymentDate
      ? new Date(invoice.paymentDate).toISOString()
      : null,
    invoiceNumber: invoice.invoiceNumber || "",
    invoiceDate: invoice.invoiceDate
      ? new Date(invoice.invoiceDate).toISOString()
      : "",
    stockMovementId: invoice.stockMovementId?._id
      ? invoice.stockMovementId._id.toString()
      : invoice.stockMovementId?.toString() || "",
    totalAmount: invoice.totalAmount ?? 0,
    productName: invoice.stockMovementId?.productId?.name || "Unknown Product",
    createdAt: invoice.createdAt
      ? new Date(invoice.createdAt).toISOString()
      : undefined,
    updatedAt: invoice.updatedAt
      ? new Date(invoice.updatedAt).toISOString()
      : undefined,
  };
}

// GET ALL
export async function getSupplierInvoices() {
  try {
    const invoices = await getSupplierInvoicesService();
    return invoices.map(supplierInvoiceMap);
  } catch (err) {
    console.error("❌ getSupplierInvoices error:", err);
    return [];
  }
}

// GET ONE
export async function getSupplierInvoiceById(id: string) {
  try {
    const invoice = await getSupplierInvoiceByIdService(id);
    return invoice ? supplierInvoiceMap(invoice) : null;
  } catch (err) {
    console.error("❌ getSupplierInvoiceById error:", err);
    return null;
  }
}
