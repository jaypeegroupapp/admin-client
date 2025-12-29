"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { roleFormSchema } from "@/validations/role";
import {
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "@/services/role";
import { IRole } from "@/definitions/role";

export async function createRoleAction(
  roleId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = roleFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as IRole;

    if (roleId) {
      const existing = await getRoleByIdService(roleId);
      if (!existing) {
        return {
          message: "Role not found",
          errors: { global: "Invalid role ID" },
        };
      }
      await updateRoleService(roleId, data);
    } else {
      await createRoleService(data);
    }
  } catch (error: any) {
    console.error("❌ createRoleAction error:", error);
    return {
      message: "Failed to create or update role",
      errors: { global: error.message },
    };
  }

  revalidatePath("/roles");
  redirect("/roles");
}

export async function deleteRoleAction(id: string) {
  await deleteRoleService(id);
  revalidatePath("/roles");
}
