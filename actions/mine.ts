"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mineFormSchema } from "@/validations/mine";
import {
  createMineService,
  updateMineService,
  deleteMineService,
  getMineByIdService,
  updateMineStatusService,
} from "@/services/mine";
import { IMine } from "@/definitions/mine";

export async function createMineAction(
  mineId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = mineFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as IMine;

    if (mineId) {
      const existing = await getMineByIdService(mineId);
      if (!existing) {
        return {
          message: "Mine not found",
          errors: { global: "Invalid mine ID" },
        };
      }
      await updateMineService(mineId, data);
    } else {
      await createMineService(data);
    }
  } catch (error: any) {
    console.error("❌ createMineAction error:", error);
    return {
      message: "Failed to create or update mine",
      errors: { global: error.message },
    };
  }

  let url = mineId ? `/mines/${mineId}` : "/mines";
  revalidatePath(url);
  redirect(url);
}

export async function deleteMineAction(mineId: string) {
  try {
    await deleteMineService(mineId);
    revalidatePath("/mines");

    return { success: true, message: "Mine deleted successfully." };
  } catch (error: any) {
    console.error("❌ deleteMineAction error:", error);
    return { success: false, message: "Failed to delete mine." };
  }
}

export async function updateMineStatusAction(
  mineId: string,
  isActive: boolean
) {
  try {
    await updateMineStatusService(mineId, isActive);
    revalidatePath("/mines");

    return { success: true, message: "Mine updated successfully." };
  } catch (err) {
    console.error("❌ updateMineStatusAction error:", err);
    return { success: false, message: "Failed to update mine status." };
  }
}
