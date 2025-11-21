"use server";

import {
  closeSupplierInvoiceService,
  confirmSupplierInvoicePaymentService,
  deleteSupplierInvoiceService,
  updateSupplierInvoiceService,
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
    stockMovementId: invoice.stockMovementId?.toString() || "",
    totalAmount: invoice.totalAmount ?? 0,
    createdAt: invoice.createdAt
      ? new Date(invoice.createdAt).toISOString()
      : undefined,
    updatedAt: invoice.updatedAt
      ? new Date(invoice.updatedAt).toISOString()
      : undefined,
  };
}

// UPDATE
export async function updateSupplierInvoice(id: string, data: any) {
  try {
    const updated = await updateSupplierInvoiceService(id, data);
    return updated ? supplierInvoiceMap(updated) : null;
  } catch (err) {
    console.error("❌ updateSupplierInvoice error:", err);
    return null;
  }
}

// DELETE
export async function deleteSupplierInvoice(id: string) {
  try {
    return await deleteSupplierInvoiceService(id);
  } catch (err) {
    console.error("❌ deleteSupplierInvoice error:", err);
    return null;
  }
}

/* ------------------------------------------------------
 * CONFIRM PAYMENT (ACTION)
 * ------------------------------------------------------ */
export async function confirmSupplierInvoicePaymentAction(invoiceId: string) {
  try {
    const result = await confirmSupplierInvoicePaymentService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ confirmSupplierInvoicePaymentAction error:", error);
    return { success: false, message: "Failed to confirm invoice payment." };
  }
}

/* ------------------------------------------------------
 * CLOSE INVOICE (ACTION)
 * ------------------------------------------------------ */
export async function closeSupplierInvoiceAction(invoiceId: string) {
  try {
    const result = await closeSupplierInvoiceService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ closeSupplierInvoiceAction error:", error);
    return { success: false, message: "Failed to close invoice." };
  }
}
