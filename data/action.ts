"use server";
import { mapAction } from "./mapper";
import { getAllActionsService } from "@/services/action";

export async function getActions() {
  try {
    const result = await getAllActionsService();
    const actions = Array.isArray(result) ? result.map(mapAction) : [];
    return { success: true, data: actions };
  } catch (error: any) {
    console.error("❌ getActions error:", error);
    return { success: false, message: error.message };
  }
}
