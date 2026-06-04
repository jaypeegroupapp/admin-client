"use server";

import { revalidatePath } from "next/cache";
import { restockTankerService } from "@/services/tanker-stock";
import { restockTankerSchema } from "@/validations/tanker-stock";

export async function restockTankerAction(
  tankerId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      quantityAdded: formData.get("quantityAdded"),
      actualMeterReading: formData.get("actualMeterReading"),
      manualDippingReading: formData.get("manualDippingReading"),
      beforeStock: formData.get("beforeStock"),
      supplierName: formData.get("supplierName"),
      invoiceNumber: formData.get("invoiceNumber"),
      invoiceUnitPrice: formData.get("invoiceUnitPrice"),
      invoiceDate: formData.get("invoiceDate"),
      gridAtPurchase: formData.get("gridAtPurchase"),
      discount: formData.get("discount") || 0,
      notes: formData.get("notes") || undefined,
      restockDate: formData.get("restockDate"),
    };

    const validated = restockTankerSchema.safeParse(rawData);

    if (!validated.success) {
      console.log("Validation errors:", validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    await restockTankerService(
      tankerId,
      data.quantityAdded,
      data.actualMeterReading,
      data.manualDippingReading,
      data.beforeStock ? Number(data.beforeStock) : undefined,
      data.supplierName,
      data.invoiceNumber,
      data.invoiceUnitPrice ? Number(data.invoiceUnitPrice) : undefined,
      data.invoiceDate ? new Date(data.invoiceDate) : undefined,
      data.gridAtPurchase ? Number(data.gridAtPurchase) : undefined,
      data.discount,
      data.notes,
      data.restockDate ? new Date(data.restockDate) : undefined,
    );

    revalidatePath(`/tankers/${tankerId}`);
    return {
      success: true,
      message: "Tanker restocked successfully",
      errors: {},
    };
  } catch (error: any) {
    console.error("❌ restockTankerAction error:", error);
    return {
      message: error.message || "Failed to record restock",
      errors: { global: error.message },
    };
  }
}
