// src/data/dispenser-usage.ts
"use server";
import {
  getDispenserUsageHistoryService,
  getTotalDispenserUsageService,
} from "@/services/dispenser-usage";

export async function getTotalDispenserUsage(dispenserId: string) {
  try {
    return await getTotalDispenserUsageService(dispenserId);
  } catch (err) {
    console.error("❌ getTotalDispenserUsage error:", err);
    return 0;
  }
}

export async function getDispenserUsageHistory(dispenserId: string) {
  try {
    const usage = await getDispenserUsageHistoryService(dispenserId);
    const arr = Array.isArray(usage) ? usage.map(mapDispenserUsage) : [];
    // console.log({ arr });
    return arr;
  } catch (err) {
    console.error("❌ getDispenserUsageHistory error:", err);
    return [];
  }
}

function mapDispenserUsage(doc: any): any {
  // Extract attendant name from the populated data
  let attendantName = null;
  let attendantStaffName = null;

  if (doc.attendanceId) {
    // Try to get from attendantId -> userId path
    if (doc.attendanceId.attendantId?.userId) {
      attendantName = doc.attendanceId.attendantId.userId.name;
      attendantStaffName = doc.attendanceId.attendantId.name;
    }
    // Fallback to direct userId
    else if (doc.attendanceId.userId) {
      attendantName = doc.attendanceId.userId.name;
    }
  }

  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    litresDispensed: doc.litresDispensed,
    timestamp: doc.timestamp?.toISOString(),

    // Order info
    orderId: doc.orderId?._id?.toString() || doc.orderId?.toString(),
    orderNumber: doc.orderId?.orderNumber,

    // Cash transaction info
    cashTransactionId:
      doc.cashTransactionId?._id?.toString() ||
      doc.cashTransactionId?.toString(),
    cashTransactionDetails: doc.cashTransactionId
      ? {
          companyName: doc.cashTransactionId.companyName,
          plateNumber: doc.cashTransactionId.plateNumber,
          driverName: doc.cashTransactionId.driverName,
          total: doc.cashTransactionId.total,
        }
      : null,

    // Attendance info
    attendanceId:
      doc.attendanceId?._id?.toString() || doc.attendanceId?.toString(),
    attendantName: attendantName,
    attendantStaffName: attendantStaffName,
    attendanceLoginTime: doc.attendanceId?.loginTime?.toISOString(),
    attendanceLogoutTime: doc.attendanceId?.logoutTime?.toISOString(),

    // Balance tracking
    balanceBefore: doc.balanceBefore,
    balanceAfter: doc.balanceAfter,

    // Type and metadata
    type: doc.type,
    metadata: doc.metadata || {},
    createdAt: doc.createdAt?.toISOString(),
  };
}

/* 
function mapDispenserUsage(doc: any): any {
  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    litresDispensed: doc.litresDispensed,
    timestamp: doc.timestamp?.toISOString(),
    orderId: doc.orderId?.toString(),
    createdAt: doc.createdAt?.toISOString(),
  };
} */
