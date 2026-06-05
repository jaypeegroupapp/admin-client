"use server";

import {
  getDispenserUsageHistoryPaginatedService,
  getDispenserUsageHistoryService,
  getTotalDispenserUsageService,
  getDispenserUsageTotalsService,
} from "@/services/dispenser-usage";

export async function getTotalDispenserUsage(dispenserId: string) {
  try {
    return await getTotalDispenserUsageService(dispenserId);
  } catch (err) {
    console.error("❌ getTotalDispenserUsage error:", err);
    return 0;
  }
}

export async function getDispenserUsageHistoryPaginated(
  dispenserId: string,
  page: number = 0,
  pageSize: number = 10,
  filter: string = "all",
) {
  try {
    const result = await getDispenserUsageHistoryPaginatedService(
      dispenserId,
      page,
      pageSize,
      filter,
    );

    return {
      data: result.data.map(mapDispenserUsage),
      totalCount: result.totalCount,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    };
  } catch (err) {
    console.error("❌ getDispenserUsageHistoryPaginated error:", err);
    return {
      data: [],
      totalCount: 0,
      page: 0,
      pageSize: 10,
      totalPages: 0,
    };
  }
}

export async function getDispenserUsageTotals(
  dispenserId: string,
  filter: string = "all",
) {
  try {
    const result = await getDispenserUsageTotalsService(dispenserId, filter);
    return result;
  } catch (err) {
    console.error("❌ getDispenserUsageTotals error:", err);
    return { totalLitres: 0, transactionCount: 0 };
  }
}

export async function getDispenserUsageHistory(dispenserId: string) {
  try {
    const usage = await getDispenserUsageHistoryService(dispenserId);
    const arr = Array.isArray(usage) ? usage.map(mapDispenserUsage) : [];
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
    if (doc.attendanceId.attendantId?.userId) {
      attendantName = doc.attendanceId.attendantId.userId.name;
      attendantStaffName = doc.attendanceId.attendantId.name;
    } else if (doc.attendanceId.userId) {
      attendantName = doc.attendanceId.userId.name;
    }
  }

  // Extract metadata
  const metadata = doc.metadata || {};

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

    // Tanker info from metadata
    tankerId: metadata.tankerId,
    tankerName: metadata.tankerName,

    // Attendance info
    attendanceId:
      doc.attendanceId?._id?.toString() || doc.attendanceId?.toString(),
    attendantName: attendantName,
    attendantStaffName: attendantStaffName,
    attendanceLoginTime: doc.attendanceId?.loginTime?.toISOString(),
    attendanceLogoutTime: doc.attendanceId?.logoutTime?.toISOString(),

    // Balance tracking (meter readings)
    balanceBefore: doc.balanceBefore,
    balanceAfter: doc.balanceAfter,

    // Type and metadata
    type: doc.type,
    metadata: metadata,
    createdAt: doc.createdAt?.toISOString(),
  };
}
