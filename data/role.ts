"use server";
import { mapRole } from "./mapper";
import {
  getAllRolesService,
  getRoleActionsService,
  getRoleByIdService,
} from "@/services/role";

export async function getRoles() {
  try {
    const result = await getAllRolesService();
    const roles = Array.isArray(result) ? result.map(mapRole) : [];
    return { success: true, data: roles };
  } catch (error: any) {
    console.error("❌ getRoles error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch roles",
    };
  }
}

export async function getRoleById(id: string) {
  try {
    const role = await getRoleByIdService(id);
    if (!role) return { success: false, message: "Role not found" };
    return { success: true, data: mapRole(role) };
  } catch (error: any) {
    console.error("❌ getRoleById error:", error);
    return { success: false, message: error.message };
  }
}

export async function getRoleActions(roleId: string) {
  try {
    const role = (await getRoleActionsService(roleId)) as any;

    if (!role) {
      return { success: false, message: "Role not found" };
    }

    const actionIds = Array.isArray(role)
      ? role.map((id: any) => id.toString())
      : [];

    return { success: true, data: actionIds };
  } catch (error: any) {
    console.error("❌ getRoleActions error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch role actions",
    };
  }
}
