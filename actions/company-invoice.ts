"use server";

import {
  publishInvoiceService,
  confirmInvoicePaymentService,
  closeInvoiceService,
} from "@/services/company-invoice";

// ---------------- PUBLISH INVOICE ----------------
export async function publishCompanyInvoiceAction(invoiceId: string) {
  try {
    const result = await publishInvoiceService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ publishInvoiceAction error:", error);
    return { success: false, message: "Failed to publish invoice." };
  }
}

// ---------------- CONFIRM PAYMENT ----------------
export async function confirmCompanyInvoicePaymentAction(invoiceId: string) {
  try {
    const result = await confirmInvoicePaymentService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ confirmInvoicePaymentAction error:", error);
    return { success: false, message: "Failed to confirm invoice payment." };
  }
}

// ---------------- CLOSE INVOICE ----------------
export async function closeCompanyInvoiceAction(invoiceId: string) {
  try {
    const result = await closeInvoiceService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ closeInvoiceAction error:", error);
    return { success: false, message: "Failed to close invoice." };
  }
}
