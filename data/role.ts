import { mapRole } from "./mapper";
import { getAllRolesService } from "@/services/role";

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
