// src/models/dispenser-stock-record.ts
import { IDispenserStockRecord } from "@/definitions/dispenser-stock-record";
import mongoose, { Schema, Document, Types } from "mongoose";

interface DispenserStockRecordDocument
  extends
    Document,
    Omit<IDispenserStockRecord, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const DispenserStockRecordSchema = new Schema<DispenserStockRecordDocument>(
  {
    dispenserId: {
      type: Schema.Types.ObjectId,
      ref: "Dispenser",
      required: true,
    },
    openingBalance: { type: Number, required: true, min: 0 },
    purchaseId: { type: Schema.Types.ObjectId, ref: "SupplierInvoice" },
    purchasedQuantity: { type: Number, required: true, min: 0 },

    // Supplier invoice details
    supplierName: { type: String },
    invoiceNumber: { type: String },
    invoiceUnitPrice: { type: Number, min: 0 },
    invoiceDate: { type: Date },

    // Pricing details
    gridAtPurchase: { type: Number, min: 0 },
    discount: { type: Number, min: 0, default: 0 },

    expectedClosingBalance: { type: Number, required: true, min: 0 },
    actualMeterReading: { type: Number, required: true, min: 0 },
    variance: { type: Number, required: true },
    variancePercentage: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "discrepancy"],
      default: "pending",
    },
    fillDate: { type: Date, default: Date.now },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true },
);

// Indexes
DispenserStockRecordSchema.index({ dispenserId: 1, fillDate: -1 });
DispenserStockRecordSchema.index({ invoiceNumber: 1 });
DispenserStockRecordSchema.index({ status: 1 });

const DispenserStockRecord =
  mongoose.connection.models.DispenserStockRecord ||
  mongoose.model<DispenserStockRecordDocument>(
    "DispenserStockRecord",
    DispenserStockRecordSchema,
  );

export default DispenserStockRecord;
