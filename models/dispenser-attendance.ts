// src/models/dispenser-attendance-record.ts
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";
import mongoose, { Schema } from "mongoose";
import Staff from "./staff";
import User from "./user";
import Dispenser from "./dispenser";

const DispenserAttendanceRecordSchema = new Schema<IDispenserAttendanceRecord>(
  {
    dispenserId: {
      type: Schema.Types.ObjectId,
      ref: Dispenser.modelName,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    attendantId: {
      type: Schema.Types.ObjectId,
      ref: Staff.modelName,
      required: true,
    },
    openingBalanceLitres: { type: Number, required: true, min: 0 },
    closingBalanceLitres: { type: Number, min: 0 },
    totalDispensed: { type: Number, default: 0, min: 0 },
    expectedClosing: { type: Number, min: 0 },
    variance: { type: Number, default: 0 },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    status: {
      type: String,
      enum: ["active", "completed", "reconciled"],
      default: "active",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

// Indexes
DispenserAttendanceRecordSchema.index({ dispenserId: 1, status: 1 });
DispenserAttendanceRecordSchema.index({ userId: 1, status: 1 });

const DispenserAttendanceRecord =
  mongoose.models.DispenserAttendanceRecord ||
  mongoose.model<IDispenserAttendanceRecord>(
    "DispenserAttendanceRecord",
    DispenserAttendanceRecordSchema,
  );

export default DispenserAttendanceRecord;
