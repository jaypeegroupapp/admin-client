import CashTransaction from "@/models/cash-transactions";
import { FilterQuery } from "mongoose";
import { ICashTransaction } from "@/definitions/cash-transactions";
import { connectDB } from "@/lib/db";

interface CashTransactionDocument {
  _id: string;
  companyName: string;
  plateNumber: string;
  litresPurchased: number;
  grid: number;
  plusDiscount: number;
  total: number;
  driverName: string;
  phoneNumber: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export async function getCashTransactionsService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = "",
): Promise<{
  data: CashTransactionDocument[];
  totalCount: number;
  stats: Record<string, number>;
}> {
  const skip = page * pageSize;

  const filter: FilterQuery<CashTransactionDocument> = {};

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

export async function createCashTransactionService(
  data: Partial<ICashTransaction>,
) {
  await connectDB();
  return await CashTransaction.create(data);
}
