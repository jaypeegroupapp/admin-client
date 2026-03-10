// src/data/dispenser-attendance.ts
"use server";

import {
  getAvailableAttendantsService,
  getCurrentAttendanceService,
  getDispenserAttendanceRecordsService,
} from "@/services/dispenser-attendance";

export async function getCurrentAttendance(dispenserId: string) {
  try {
    const attendance = await getCurrentAttendanceService(dispenserId);
    return attendance ? mapAttendanceRecord(attendance) : null;
  } catch (error) {
    console.error("❌ getCurrentAttendance error:", error);
    return null;
  }
}

export async function getDispenserAttendanceRecords(dispenserId: string) {
  try {
    const records = await getDispenserAttendanceRecordsService(dispenserId);
    return records.map(mapAttendanceRecord);
  } catch (error) {
    console.error("❌ getDispenserAttendanceRecords error:", error);
    return [];
  }
}

// Get available attendants (active staff not assigned to any dispenser)
export async function getAvailableAttendants() {
  try {
    // Get available attendants from service
    const attendants = await getAvailableAttendantsService();

    // Map the data
    const mappedAttendants = attendants.map((attendant: any) => ({
      id: attendant.id,
      name: attendant.name,
      email: attendant.email,
      userId: attendant.userId,
      status: attendant.status,
      mines: attendant.mines || [],
    }));

    return {
      success: true,
      data: mappedAttendants,
    };
  } catch (error: any) {
    console.error("❌ getAvailableAttendants error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch available attendants",
      data: [],
    };
  }
}

function mapAttendanceRecord(doc: any): any {
  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    userId: doc.userId.toString(),
    attendantId: doc.attendantId?.toString(),
    attendantName: (doc.attendantId as any)?.name || "Unknown",
    openingBalanceLitres: doc.openingBalanceLitres,
    closingBalanceLitres: doc.closingBalanceLitres,
    totalDispensed: doc.totalDispensed,
    expectedClosing: doc.expectedClosing,
    variance: doc.variance,
    loginTime: doc.loginTime?.toISOString(),
    logoutTime: doc.logoutTime?.toISOString(),
    status: doc.status,
    notes: doc.notes,
    createdAt: doc.createdAt?.toISOString(),
  };
}
