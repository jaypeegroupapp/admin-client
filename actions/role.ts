"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { roleFormSchema } from "@/validations/role";
import {
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
  assignActionToRoleService,
  removeActionFromRoleService,
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

export async function assignActionToRoleAction(
  roleId: string,
  actionId: string
) {
  try {
    const role = await assignActionToRoleService(roleId, actionId);

    if (!role) {
      return { success: false, message: "Role not found" };
    }

    revalidatePath(`/roles/${roleId}`);

    return { success: true };
  } catch (error: any) {
    console.error("❌ assignActionToRoleAction error:", error);
    return { success: false, message: error.message };
  }
}

export async function removeActionFromRoleAction(
  roleId: string,
  actionId: string
) {
  try {
    const role = await removeActionFromRoleService(roleId, actionId);

    if (!role) {
      return { success: false, message: "Role not found" };
    }

    revalidatePath(`/roles/${roleId}`);

    return { success: true };
  } catch (error: any) {
    console.error("❌ removeActionFromRoleAction error:", error);
    return { success: false, message: error.message };
  }
}
