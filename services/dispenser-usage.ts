// src/services/dispenser-usage.ts
import mongoose from "mongoose";
import DispenserUsage from "@/models/dispenser-usage";
import { connectDB } from "@/lib/db";

/* export async function getTotalDispenserUsageService(dispenserId: string) {
  await connectDB();

  const usageObj = await DispenserUsage.aggregate([
    {
      $match: {
        dispenserId: new mongoose.Types.ObjectId(dispenserId),
      },
    },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: "$litresDispensed" },
      },
    },
  ]);

  return usageObj[0]?.totalLitres || 0;
}
 */
/**
 * Get dispenser usage history for a specific dispenser
 */
/* export async function getDispenserUsageHistoryService(
  dispenserId: string,
  limit?: number,
  fromDate?: Date,
  toDate?: Date,
) {
  await connectDB();

  const filter: any = {
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  };

  if (fromDate || toDate) {
    filter.timestamp = {};
    if (fromDate) filter.timestamp.$gte = fromDate;
    if (toDate) filter.timestamp.$lte = toDate;
  }

  let query = DispenserUsage.find(filter)
    .populate("cashTransactionId")
    .populate("attendanceId", "loginTime logoutTime")
    .sort({ timestamp: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  return await query.lean();
}

 */ /**
 * Create a dispenser usage record for audit trail
 */
export async function createDispenserUsageService(data: {
  dispenserId: string;
  litresDispensed: number;
  timestamp: Date;
  cashTransactionId: string;
  attendanceId: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: {
    companyName?: string;
    plateNumber?: string;
    driverName?: string;
  };
}) {
  await connectDB();

  const usageRecord = await DispenserUsage.create({
    dispenserId: new mongoose.Types.ObjectId(data.dispenserId),
    litresDispensed: data.litresDispensed,
    timestamp: data.timestamp,
    cashTransactionId: new mongoose.Types.ObjectId(data.cashTransactionId),
    attendanceId: new mongoose.Types.ObjectId(data.attendanceId),
    balanceBefore: data.balanceBefore,
    balanceAfter: data.balanceAfter,
    metadata: data.metadata,
    type: "SALE", // Add type field to distinguish from stock fills
  });

  return usageRecord;
}

/**
 * Get total litres dispensed from a dispenser in a date range
 */
export async function getTotalDispensedService(
  dispenserId: string,
  fromDate?: Date,
  toDate?: Date,
) {
  await connectDB();

  const filter: any = {
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  };

  if (fromDate || toDate) {
    filter.timestamp = {};
    if (fromDate) filter.timestamp.$gte = fromDate;
    if (toDate) filter.timestamp.$lte = toDate;
  }

  const result = await DispenserUsage.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: "$litresDispensed" },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);

  return result[0] || { totalLitres: 0, totalTransactions: 0 };
}

export async function getTotalDispenserUsageService(dispenserId: string) {
  await connectDB();

  const usageObj = await DispenserUsage.aggregate([
    {
      $match: {
        dispenserId: new mongoose.Types.ObjectId(dispenserId),
      },
    },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: "$litresDispensed" },
      },
    },
  ]);

  return usageObj[0]?.totalLitres || 0;
}

export async function getDispenserUsageHistoryService(
  dispenserId: string,
  limit?: number,
  fromDate?: Date,
  toDate?: Date,
) {
  await connectDB();

  const filter: any = {
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  };

  if (fromDate || toDate) {
    filter.timestamp = {};
    if (fromDate) filter.timestamp.$gte = fromDate;
    if (toDate) filter.timestamp.$lte = toDate;
  }

  let query = DispenserUsage.find(filter)
    .populate({
      path: "cashTransactionId",
      select: "companyName plateNumber driverName total",
    })
    .populate({
      path: "orderId",
      select: "orderNumber truckNumber status",
    })
    .populate({
      path: "attendanceId",
      populate: [
        {
          path: "attendantId", // First populate the staff record
          model: "Staff",
          populate: {
            path: "userId", // Then populate the user from staff
            model: "User",
            select: "name email",
          },
        },
        {
          path: "userId", // Also populate the direct user reference
          model: "User",
          select: "name email",
        },
      ],
    })
    .sort({ timestamp: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  const results = await query.lean();

  // Transform the data to include metadata from populated fields
  return results.map((record: any) => {
    // If it's a cash transaction, merge the metadata
    if (record.cashTransactionId) {
      record.metadata = {
        ...record.metadata,
        companyName: record.cashTransactionId.companyName,
        plateNumber: record.cashTransactionId.plateNumber,
        driverName: record.cashTransactionId.driverName,
      };
    }
    return record;
  });
}

export async function getDispenserUsageStatsService(
  dispenserId: string,
  fromDate?: Date,
  toDate?: Date,
) {
  await connectDB();

  const filter: any = {
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  };

  if (fromDate || toDate) {
    filter.timestamp = {};
    if (fromDate) filter.timestamp.$gte = fromDate;
    if (toDate) filter.timestamp.$lte = toDate;
  }

  const stats = await DispenserUsage.aggregate([
    { $match: filter },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalLitres: { $sum: "$litresDispensed" },
              totalTransactions: { $sum: 1 },
              avgLitres: { $avg: "$litresDispensed" },
            },
          },
        ],
        byType: [
          {
            $group: {
              _id: {
                type: {
                  $cond: [
                    { $ifNull: ["$cashTransactionId", false] },
                    "cash",
                    {
                      $cond: [
                        { $ifNull: ["$orderId", false] },
                        "order",
                        "other",
                      ],
                    },
                  ],
                },
              },
              count: { $sum: 1 },
              litres: { $sum: "$litresDispensed" },
            },
          },
        ],
        daily: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
              },
              litres: { $sum: "$litresDispensed" },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 7 },
        ],
      },
    },
  ]);

  return (
    stats[0] || {
      totals: [{ totalLitres: 0, totalTransactions: 0, avgLitres: 0 }],
      byType: [],
      daily: [],
    }
  );
}
