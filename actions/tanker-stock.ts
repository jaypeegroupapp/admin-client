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
    const validated = restockTankerSchema.safeParse({
      quantityAdded: formData.get("quantityAdded"),
      supplierName: formData.get("supplierName"),
      invoiceNumber: formData.get("invoiceNumber"),
      notes: formData.get("notes"),
      restockDate: formData.get("restockDate"),
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { quantityAdded, supplierName, invoiceNumber, notes, restockDate } =
      validated.data;

    await restockTankerService(
      tankerId,
      quantityAdded,
      supplierName,
      invoiceNumber,
      notes,
      restockDate ? new Date(restockDate) : undefined,
    );

    revalidatePath(`/tankers/${tankerId}`);
    return { success: true, message: "Tanker restocked successfully" };
  } catch (error: any) {
    console.error("❌ restockTankerAction error:", error);
    return {
      message: "Failed to record restock",
      errors: { global: error.message },
    };
  }
}
