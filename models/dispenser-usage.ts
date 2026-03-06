// src/models/dispenser-usage.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDispenserUsage {
  id?: string;
  dispenserId: Types.ObjectId | string;
  litresDispensed: number;
  timestamp: Date;
  orderId?: Types.ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
}

interface DispenserUsageDocument extends Document, Omit<IDispenserUsage, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const DispenserUsageSchema = new Schema<DispenserUsageDocument>(
  {
    dispenserId: { type: Schema.Types.ObjectId, ref: "Dispenser", required: true },
    litresDispensed: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: Date.now },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

DispenserUsageSchema.index({ dispenserId: 1, timestamp: -1 });

const DispenserUsage = 
  mongoose.connection.models.DispenserUsage ||
  mongoose.model<DispenserUsageDocument>("DispenserUsage", DispenserUsageSchema);

export default DispenserUsage;