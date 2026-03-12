// src/services/cash-transaction.ts
import { connectDB } from "@/lib/db";
import CashTransaction from "@/models/cash-transactions";
import Dispenser from "@/models/dispenser";
import DispenserUsage from "@/models/dispenser-usage";
import DispenserAttendanceRecord from "@/models/dispenser-attendance";
import { FilterQuery } from "mongoose";
import { ICashTransaction } from "@/definitions/cash-transactions";
import mongoose from "mongoose";

type CashTransactionDocument = any;

export async function createCashTransactionService(
  data: Partial<ICashTransaction>,
) {
  await connectDB();
  return await CashTransaction.create(data);
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
  await connectDB();
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
      .populate("dispenserId", "name")
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

export async function completeCashTransactionService(
  transactionId: string,
  userId: string,
  signature?: string,
) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get transaction
    const transaction = (await CashTransaction.findById(transactionId).session(
      session,
    )) as any;

    if (!transaction) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Transaction not found" };
    }

    if (transaction.status === "completed") {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Transaction already completed" };
    }

    // Find dispenser assigned to current user
    const dispenser = await Dispenser.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      isPublished: true,
    }).session(session);

    if (!dispenser) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "No dispenser assigned to you. Please contact your manager.",
      };
    }

    // Find active attendance
    const attendance = await DispenserAttendanceRecord.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      dispenserId: dispenser._id,
      status: "active",
    }).session(session);

    if (!attendance) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "You are not logged into this dispenser. Please log in first.",
      };
    }

    // Check stock
    const quantity = transaction.litresPurchased || 0;
    if (dispenser.litres < quantity) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: `Insufficient stock. Available: ${dispenser.litres}L, Required: ${quantity}L`,
      };
    }

    // Update transaction
    const balanceBefore = dispenser.litres;
    const balanceAfter = balanceBefore - quantity;

    transaction.status = "completed";
    transaction.dispenserId = dispenser._id;
    transaction.attendanceId = attendance._id;
    transaction.completedById = new mongoose.Types.ObjectId(userId);
    transaction.completedAt = new Date();
    transaction.signature = signature;
    transaction.balanceBefore = balanceBefore;
    transaction.balanceAfter = balanceAfter;

    await transaction.save({ session });

    // Update dispenser stock
    dispenser.litres = balanceAfter;
    dispenser.lastReading = balanceAfter;
    dispenser.lastReadingDate = new Date();
    await dispenser.save({ session });

    // Create dispenser usage record
    await DispenserUsage.create(
      [
        {
          dispenserId: dispenser._id,
          litresDispensed: quantity,
          timestamp: new Date(),
          cashTransactionId: transaction._id,
          attendanceId: attendance._id,
          balanceBefore,
          balanceAfter,
          metadata: {
            companyName: transaction.companyName,
            plateNumber: transaction.plateNumber,
            driverName: transaction.driverName,
          },
        },
      ],
      { session },
    );

    // Update attendance record total dispensed
    attendance.totalDispensed = (attendance.totalDispensed || 0) + quantity;
    await attendance.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Transaction completed successfully",
      dispenserId: dispenser._id.toString(),
      data: {
        dispenserName: dispenser.name,
        litresBefore: balanceBefore,
        litresAfter: balanceAfter,
        litresSold: quantity,
        total: transaction.total,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ completeCashTransactionService error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to complete transaction",
    };
  }
}
