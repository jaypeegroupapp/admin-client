// data/staff.ts
"use server";

import { getAllStaffService } from "@/services/staff";
import { mapStaff } from "./mapper";

export async function getStaffs() {
  try {
    const result = await getAllStaffService();
    const staffs = Array.isArray(result) ? result.map(mapStaff) : [];
    return { success: true, data: staffs };
  } catch (error: any) {
    console.error("❌ getStaffs error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch staff",
    };
  }
}
