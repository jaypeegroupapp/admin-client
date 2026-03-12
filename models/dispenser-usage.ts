// src/models/dispenser-usage.ts
import { IDispenserUsage } from "@/definitions/dispenser-usage";
import mongoose, { Schema, Document, Types } from "mongoose";

interface DispenserUsageDocument
  extends Document, Omit<IDispenserUsage, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const DispenserUsageSchema = new Schema<DispenserUsageDocument>(
  {
    dispenserId: {
      type: Schema.Types.ObjectId,
      ref: "Dispenser",
      required: true,
    },
    litresDispensed: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    orderItemId: { type: Schema.Types.ObjectId, ref: "OrderItem" }, // Add this
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "DispenserAttendanceRecord",
    }, // Add this
    balanceBefore: { type: Number, min: 0 }, // Add this
    balanceAfter: { type: Number, min: 0 }, // Add this
  },
  { timestamps: true },
);

DispenserUsageSchema.index({ dispenserId: 1, timestamp: -1 });
DispenserUsageSchema.index({ orderItemId: 1 });

const DispenserUsage =
  mongoose.connection.models.DispenserUsage ||
  mongoose.model<DispenserUsageDocument>(
    "DispenserUsage",
    DispenserUsageSchema,
  );

export default DispenserUsage;
