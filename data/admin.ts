"use server";

import { getAdminDashboardDataService } from "@/services/admin";

export async function getAdminDashboardData() {
  try {
    const data = await getAdminDashboardDataService();
    return { success: true, data };
  } catch (error: any) {
    console.error("❌ getAdminDashboardData error:", error);
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
}
