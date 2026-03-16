// src/services/dispenser-usage.ts
import mongoose from "mongoose";
import DispenserUsage from "@/models/dispenser-usage";
import { connectDB } from "@/lib/db";

/**
 * Create a dispenser usage record for audit trail
 */
export async function createDispenserUsageService(data: {
  dispenserId: string;
  litresDispensed: number;
  timestamp: Date;
  cashTransactionId?: string;
  orderId?: string;
  orderItemId?: string;
  attendanceId: string;
  balanceBefore: number;
  balanceAfter: number;
  type: "SALE" | "STOCK_IN" | "ADJUSTMENT";
  metadata?: {
    companyName?: string;
    plateNumber?: string;
    driverName?: string;
  };
}) {
  await connectDB();

  const usageData: any = {
    dispenserId: new mongoose.Types.ObjectId(data.dispenserId),
    litresDispensed: data.litresDispensed,
    timestamp: data.timestamp,
    attendanceId: new mongoose.Types.ObjectId(data.attendanceId),
    balanceBefore: data.balanceBefore,
    balanceAfter: data.balanceAfter,
    type: data.type,
    metadata: data.metadata || {},
  };

  if (data.cashTransactionId) {
    usageData.cashTransactionId = new mongoose.Types.ObjectId(
      data.cashTransactionId,
    );
  }

  if (data.orderId) {
    usageData.orderId = new mongoose.Types.ObjectId(data.orderId);
  }

  if (data.orderItemId) {
    usageData.orderItemId = new mongoose.Types.ObjectId(data.orderItemId);
  }

  const usageRecord = await DispenserUsage.create(usageData);
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

/**
 * Get dispenser usage history with full population
 */
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
      select: "orderNumber truckNumber companyName driverName",
    })
    .populate({
      path: "attendanceId",
      populate: [
        {
          path: "attendantId",
          model: "Staff",
          populate: {
            path: "userId",
            model: "User",
            select: "name email",
          },
        },
        {
          path: "userId",
          model: "User",
          select: "name email",
        },
      ],
    })
    .sort({ timestamp: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  return await query.lean();
}

/**
 * Get dispenser usage statistics
 */
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
                        "$type",
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
        byAttendant: [
          {
            $group: {
              _id: "$attendanceId",
              count: { $sum: 1 },
              litres: { $sum: "$litresDispensed" },
            },
          },
          { $sort: { litres: -1 } },
          { $limit: 5 },
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
      byAttendant: [],
      daily: [],
    }
  );
}
