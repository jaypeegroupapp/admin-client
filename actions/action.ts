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
    const parsed = actionFormSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
      return {
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { name, description } = parsed.data;

    // 🔥 Derive resource from action name
    const [resource] = name.split(":");

    const payload: IAction = {
      name,
      resource,
      description,
    };

    if (actionId) {
      const existing = await getActionByIdService(actionId);

      if (!existing) {
        return {
          message: "Action not found",
          errors: { global: "Invalid action ID" },
        };
      }

      await updateActionService(actionId, payload);
    } else {
      await createActionService(payload);
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
  await deleteActionService(id);
  revalidatePath("/actions");
}
