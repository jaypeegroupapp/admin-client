// src/models/dispenser-usage.ts
import { IDispenserUsage } from "@/definitions/dispenser-usage";
import mongoose, { Schema, Document } from "mongoose";
import CashTransaction from "./cash-transactions";
import OrderItem from "./order-item";
import Order from "./order";
import DispenserAttendanceRecord from "./dispenser-attendance";
import Dispenser from "./dispenser";

interface DispenserUsageDocument
  extends Document, Omit<IDispenserUsage, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const DispenserUsageSchema = new Schema<DispenserUsageDocument>(
  {
    dispenserId: {
      type: Schema.Types.ObjectId,
      ref: Dispenser.modelName,
      required: true,
    },
    litresDispensed: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now, required: true },

    // Related entities
    orderId: { type: Schema.Types.ObjectId, ref: Order.modelName },
    orderItemId: { type: Schema.Types.ObjectId, ref: OrderItem.modelName },
    cashTransactionId: {
      type: Schema.Types.ObjectId,
      ref: CashTransaction.modelName,
    },
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: DispenserAttendanceRecord.modelName,
    },

    // Balance tracking
    balanceBefore: { type: Number, min: 0 },
    balanceAfter: { type: Number, min: 0 },

    // Type
    type: {
      type: String,
      enum: ["SALE", "STOCK_IN", "ADJUSTMENT"],
      default: "SALE",
      required: true,
    },

    // Metadata
    metadata: {
      companyName: String,
      plateNumber: String,
      driverName: String,
    },
  },
  { timestamps: true },
);

// Indexes for efficient querying
DispenserUsageSchema.index({ dispenserId: 1, timestamp: -1 });
DispenserUsageSchema.index({ cashTransactionId: 1 });
DispenserUsageSchema.index({ orderItemId: 1 });
DispenserUsageSchema.index({ attendanceId: 1 });

const DispenserUsage =
  mongoose.connection.models.DispenserUsage ||
  mongoose.model<DispenserUsageDocument>(
    "DispenserUsage",
    DispenserUsageSchema,
  );

export default DispenserUsage;
