// src/services/dispenser-usage.ts
import mongoose from "mongoose";
import DispenserUsage from "@/models/dispenser-usage";
import { connectDB } from "@/lib/db";

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

export async function getDispenserUsageHistoryService(dispenserId: string) {
  await connectDB();

  try {
    const usage = await DispenserUsage.find({
      dispenserId: new mongoose.Types.ObjectId(dispenserId),
    })
      .sort({ timestamp: -1 })
      .populate("orderId", "status total")
      .lean();

    return JSON.parse(JSON.stringify(usage));
  } catch (error: any) {
    console.error("❌ getDispenserUsageHistoryService error:", error);
    return [];
  }
}
