// src/actions/dispenser-stock.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  recordDispenserFill,
  validateInvoiceNumber,
} from "@/services/dispenser-stock-record";
import { fillDispenserSchema } from "@/validations/dispenser-stock-record";

// Extended schema with all stock movement fields

export async function fillDispenserAction(
  dispenserId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    // Parse form data
    const rawData = {
      purchasedQuantity: formData.get("purchasedQuantity"),
      actualMeterReading: formData.get("actualMeterReading"),
      supplierName: formData.get("supplierName") || undefined,
      invoiceNumber: formData.get("invoiceNumber") || undefined,
      invoiceUnitPrice: formData.get("invoiceUnitPrice") || undefined,
      invoiceDate: formData.get("invoiceDate") || undefined,
      gridAtPurchase: formData.get("gridAtPurchase") || undefined,
      discount: formData.get("discount") || 0,
      notes: formData.get("notes") || undefined,
      fillDate: formData.get("fillDate") || undefined,
    };

    const validated = fillDispenserSchema.safeParse(rawData);

    if (!validated.success) {
      console.log("Validation errors:", validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    // Validate invoice number if provided
    if (data.invoiceNumber) {
      try {
        await validateInvoiceNumber(data.invoiceNumber, dispenserId);
      } catch (error: any) {
        return {
          message: "Invoice validation failed",
          errors: { invoiceNumber: [error.message] },
        };
      }
    }

    // Record the dispenser fill with all purchase details
    await recordDispenserFill({
      dispenserId,
      purchasedQuantity: data.purchasedQuantity,
      actualMeterReading: data.actualMeterReading,
      supplierName: data.supplierName,
      invoiceNumber: data.invoiceNumber,
      invoiceUnitPrice: data.invoiceUnitPrice,
      invoiceDate: data.invoiceDate,
      gridAtPurchase: data.gridAtPurchase,
      discount: data.discount,
      notes: data.notes,
      fillDate: data.fillDate ? new Date(data.fillDate) : undefined,
    });
  } catch (error: any) {
    console.error("❌ fillDispenserAction error:", error);
    return {
      message: "Failed to record dispenser fill",
      errors: { global: error.message },
    };
  }

  revalidatePath(`/dispensers/${dispenserId}`);
  return {
    success: true,
    message: "Dispenser fill recorded successfully",
    errors: {},
  };
}
