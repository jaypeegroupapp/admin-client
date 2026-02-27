"use server";
// data/supplier-invoice.ts
import {
  getSupplierInvoicesService,
  getSupplierInvoiceByIdService,
  getSupplierInvoiceByInvoiceNumberService,
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
    invoiceUnitPrice: invoice.invoiceUnitPrice ?? 0,
    discount: invoice.discount ?? 0,
    invoiceDate: invoice.invoiceDate
      ? new Date(invoice.invoiceDate).toISOString()
      : "",
    stockMovementId: invoice.stockMovementId?._id
      ? invoice.stockMovementId._id.toString()
      : invoice.stockMovementId?.toString() || "",
    totalAmount:
      (invoice.stockMovementId?.purchasePrice ?? 0) *
      (invoice.stockMovementId?.quantity ?? 0),
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

export async function getSupplierInvoiceByInvoiceNumber(invoiceNumber: string) {
  try {
    const invoice =
      await getSupplierInvoiceByInvoiceNumberService(invoiceNumber);
    return invoice ? supplierInvoiceMap(invoice) : null;
  } catch (err) {
    console.error("❌ getSupplierInvoiceByInvoiceNumber error:", err);
    return null;
  }
}
