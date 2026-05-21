"use server";

import { revalidatePath } from "next/cache";
import { recordSpillageService } from "@/services/tanker-spillage";
import { recordSpillageSchema } from "@/validations/tanker-spillage";

export async function recordSpillageAction(
  tankerId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = recordSpillageSchema.safeParse({
      quantity: formData.get("quantity"),
      type: formData.get("type"),
      reason: formData.get("reason"),
      estimatedCost: formData.get("estimatedCost"),
      notes: formData.get("notes"),
      spillageDate: formData.get("spillageDate"),
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { quantity, type, reason, estimatedCost, notes, spillageDate } =
      validated.data;

    await recordSpillageService(
      tankerId,
      quantity,
      type,
      reason,
      estimatedCost ? Number(estimatedCost) : undefined,
      notes,
      spillageDate ? new Date(spillageDate) : undefined,
    );

    revalidatePath(`/tankers/${tankerId}`);
    return { success: true, message: "Spillage recorded successfully" };
  } catch (error: any) {
    console.error("❌ recordSpillageAction error:", error);
    return {
      message: "Failed to record spillage",
      errors: { global: error.message },
    };
  }
}
