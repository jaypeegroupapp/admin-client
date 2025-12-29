"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionFormSchema } from "@/validations/action";
import {
  getActionByIdService,
  createActionService,
  updateActionService,
  deleteActionService,
} from "@/services/action";
import { IAction } from "@/definitions/action";

export async function createActionAction(
  actionId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = actionFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as IAction;

    if (actionId) {
      const existing = await getActionByIdService(actionId);
      if (!existing) {
        return {
          message: "Action not found",
          errors: { global: "Invalid action ID" },
        };
      }
      await updateActionService(actionId, data);
    } else {
      await createActionService(data);
    }
  } catch (error: any) {
    console.error("❌ createActionAction error:", error);
    return {
      message: "Failed to create or update action",
      errors: { global: error.message },
    };
  }

  revalidatePath("/actions");
  redirect("/actions");
}

export async function deleteActionAction(id: string) {
  try {
    await deleteActionService(id);
    revalidatePath("/actions");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
