"use server";

import { revalidatePath } from "next/cache";
import { transferToDispenserService } from "@/services/tanker-transfer";
import { transferToDispenserSchema } from "@/validations/tanker-transfer";

export async function transferToDispenserAction(
  tankerId: string,
  dispenserId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = transferToDispenserSchema.safeParse({
      quantity: formData.get("quantity"),
      notes: formData.get("notes"),
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { quantity, notes } = validated.data;

    await transferToDispenserService(tankerId, dispenserId, quantity, notes);

    revalidatePath(`/tankers/${tankerId}`);
    revalidatePath(`/dispensers/${dispenserId}`);
    return { success: true, message: "Transfer completed successfully" };
  } catch (error: any) {
    console.error("❌ transferToDispenserAction error:", error);
    return {
      message: "Failed to transfer stock",
      errors: { global: error.message },
    };
  }
}
