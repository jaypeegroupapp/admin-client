// src/data/dispenser.ts
"use server";

import {
  getAllDispensersService,
  getDispenserByIdService,
  getDispenserByUserIdService,
} from "@/services/dispenser";
import { IDispenser } from "@/definitions/dispenser";
import { getSession } from "@/lib/session";
import { getCurrentAttendanceForUserService } from "@/services/dispenser-attendance";

export async function getDispensers() {
  try {
    const result = await getAllDispensersService();
    const dispensers = Array.isArray(result) ? result.map(mapDispenser) : [];
    return { success: true, data: dispensers };
  } catch (error: any) {
    console.error("❌ getDispensers error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch dispensers",
    };
  }
}

export async function getDispenserById(id: string) {
  try {
    const result = await getDispenserByIdService(id);
    if (!result) {
      return { success: false, message: "Dispenser not found" };
    }
    return { success: true, data: mapDispenser(result) };
  } catch (error: any) {
    console.error("❌ getDispenserById error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch dispenser",
    };
  }
}

export async function getCurrentUserDispenser() {
  try {
    const session = (await getSession()) as any;

    if (!session?.user?.id) {
      return { success: false, message: "No active session", data: null };
    }

    // Find dispenser assigned to this user
    const userId = session.user.id.toString();
    const dispenser = (await getDispenserByUserIdService(userId)) as any;

    if (!dispenser) {
      return {
        success: false,
        message: "No dispenser assigned to you",
        data: null,
      };
    }

    // Get current attendance record for this user
    const attendance = (await getCurrentAttendanceForUserService(
      userId,
      dispenser._id.toString(),
    )) as any;

    return {
      success: true,
      data: {
        dispenser: mapDispenser(dispenser),
        attendance: attendance
          ? {
              id: attendance._id.toString(),
              openingBalance: attendance.openingBalanceLitres,
              loginTime: attendance.loginTime,
              totalDispensed: attendance.totalDispensed || 0,
            }
          : null,
      },
    };
  } catch (error: any) {
    console.error("❌ getCurrentUserDispenser error:", error);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
}

function mapDispenser(doc: any): IDispenser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    productId: doc.productId?._id?.toString() || doc.productId?.toString(),
    productName: doc.productId?.name?.toString(),
    litres: doc.litres ?? 0,
    isPublished: doc.isPublished ?? false,
    userId: doc.userId?._id?.toString() || doc.userId?.toString(),
    attendanceName: doc.userId?.name(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
