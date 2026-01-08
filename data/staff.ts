// data/staff.ts
"use server";

import {
  getAllStaffService,
  getStaffByIdService,
  getStaffService,
} from "@/services/staff";
import { mapStaff } from "./mapper";
import { getSession } from "@/lib/session";

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

export async function getStaffById(id: string) {
  try {
    const staff = await getStaffByIdService(id);
    if (!staff) return { success: false, message: "Staff not found" };
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("❌ getStaffById error:", error);
    return { success: false, message: error.message };
  }
}

export async function getSessionStaff() {
  try {
    const session = (await getSession()) as any;
    if (!session || !session?.user?.id)
      return { success: false, message: "No session found" };

    const staff = await getStaffService(session?.user?.id);
    if (!staff) return { success: false, message: "Staff not found" };
    return { success: true, data: staff };
  } catch (error: any) {
    console.error("❌ getStaffById error:", error);
    return { success: false, message: error.message };
  }
}
