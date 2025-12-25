"use server";

import {
  confirmInvoicePaymentService,
  closeInvoiceService,
} from "@/services/mine-invoice";
import { publishMineInvoiceService } from "@/services/mine-invoice";
import { confirmMinePaymentSchema } from "@/validations/company-invoice";
import { revalidatePath } from "next/cache";

// ---------------- PUBLISH INVOICE ----------------
export async function publishCompanyMineInvoiceAction(invoiceId: string) {
  try {
    const result = await publishMineInvoiceService(invoiceId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ publishInvoiceAction error:", error);
    return { success: false, message: "Failed to publish invoice." };
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

export async function confirmInvoicePaymentAction(
  invoiceId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = confirmMinePaymentSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { amount, paymentDate } = validated.data;

    const result = await confirmInvoicePaymentService(invoiceId, {
      amount: Number(amount),
      paymentDate: new Date(paymentDate),
    });

    if (!result.success) {
      return {
        message: result.message,
        errors: { global: result.message },
      };
    }

    revalidatePath(`/invoices/${invoiceId}`);

    return { message: "Payment confirmed successfully", errors: {} };
  } catch (error: any) {
    console.error("❌ confirmInvoicePaymentAction error:", error);
    return {
      message: "Failed to confirm payment",
      errors: { global: error.message },
    };
  }
}

export async function confirmInvoiceDebitPaymentAction(invoiceId: string) {
  try {
    const result = await confirmInvoicePaymentService(invoiceId, {
      amount: 0,
      paymentDate: new Date(),
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        errors: { message: "Failed to confirm payment" },
      };
    }

    revalidatePath(`/invoices/${invoiceId}`);

    return { message: "Payment confirmed successfully", errors: {} };
  } catch (error: any) {
    console.error("❌ confirmInvoicePaymentAction error:", error);
    return {
      message: "Failed to confirm payment",
      errors: { global: error.message },
    };
  }
}
