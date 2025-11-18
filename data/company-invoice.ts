"use server";

import {
  getCompanyInvoicesService,
  getCompanyInvoiceByIdService,
  getCompanyInvoicesByCompanyIdService,
} from "@/services/company-invoice";

const invoiceMap = (invoice: any) => ({
  id: invoice._id?.toString(),
  companyId: invoice.companyId?._id || "",
  companyName: invoice.companyId?.companyName || "",
  totalAmount: Number(invoice.totalAmount || 0),
  paymentDate: invoice.paymentDate || "",
  status: invoice.status,
  createdAt: invoice.createdAt,
  updatedAt: invoice.updatedAt,
});

/**
 * 🧾 Fetch all invoices
 */
export async function getCompanyInvoices() {
  try {
    const invoices = await getCompanyInvoicesService();
    return Array.isArray(invoices) ? invoices.map(invoiceMap) : [];
  } catch (err) {
    console.error("❌ getCompanyInvoices error:", err);
    return [];
  }
}

/**
 * 🧾 Fetch invoices by company
 */
export async function getCompanyInvoicesByCompanyId(companyId: string) {
  try {
    const invoices = await getCompanyInvoicesByCompanyIdService(companyId);
    return Array.isArray(invoices) ? invoices.map(invoiceMap) : [];
  } catch (err) {
    console.error("❌ getCompanyInvoices error:", err);
    return [];
  }
}

/**
 * 🧩 Fetch single invoice
 */
export async function getCompanyInvoiceById(id: string) {
  try {
    const invoice = await getCompanyInvoiceByIdService(id);
    return invoice ? invoiceMap(invoice) : null;
  } catch (err) {
    console.error("❌ getCompanyInvoiceById error:", err);
    return null;
  }
}
