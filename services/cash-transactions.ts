// src/services/cash-transactions.ts
import { connectDB } from "@/lib/db";
import CashTransaction from "@/models/cash-transactions";
import { FilterQuery } from "mongoose";
import { ICashTransaction } from "@/definitions/cash-transactions";
import mongoose from "mongoose";

type CashTransactionDocument = any;

export async function createCashTransactionService(
  data: Partial<ICashTransaction>,
) {
  await connectDB();

  // Ensure all ObjectId fields are properly converted
  const transactionData = {
    ...data,
    productId: data.productId
      ? new mongoose.Types.ObjectId(data.productId)
      : undefined,
    dispenserId: data.dispenserId
      ? new mongoose.Types.ObjectId(data.dispenserId)
      : undefined,
    attendanceId: data.attendanceId
      ? new mongoose.Types.ObjectId(data.attendanceId)
      : undefined,
    completedById: data.completedById
      ? new mongoose.Types.ObjectId(data.completedById)
      : undefined,
    completedAt: data.completedAt || new Date(),
  };

  const transaction = await CashTransaction.create(transactionData);
  return transaction;
}

export async function getCashTransactionsService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = "",
  dispenserId?: string,
): Promise<{
  data: CashTransactionDocument[];
  totalCount: number;
  stats: Record<string, number>;
}> {
  await connectDB();
  const skip = page * pageSize;

  const filter: FilterQuery<CashTransactionDocument> = {};

  // Add dispenser filter if provided
  if (dispenserId) {
    filter.dispenserId = new mongoose.Types.ObjectId(dispenserId);
  }

  // STATUS FILTER
  if (status !== "all") {
    filter.status = status as any;
  }

  // SEARCH FILTER
  if (search) {
    filter.$or = [
      { driverName: { $regex: search, $options: "i" } },
      { plateNumber: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
    ];
  }

  // DATE FILTER
  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const [data, totalCount] = await Promise.all([
    CashTransaction.find(filter)
      .populate("dispenserId", "name")
      .populate("productId", "name")
      .populate("completedById", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean<CashTransactionDocument[]>(),

    CashTransaction.countDocuments(filter),
  ]);

  // STATUS STATS
  const statsAggregation = await CashTransaction.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const stats: Record<string, number> = {
    all: totalCount,
    pending: 0,
    completed: 0,
    cancelled: 0,
  };

  statsAggregation.forEach((s) => {
    stats[s._id] = s.count;
  });

  return { data, totalCount, stats };
}

export async function getCashTransactionByIdService(id: string) {
  await connectDB();

  return await CashTransaction.findById(id)
    .populate("dispenserId", "name")
    .populate("productId", "name")
    .populate("completedById", "name")
    .populate("attendanceId")
    .lean();
}
