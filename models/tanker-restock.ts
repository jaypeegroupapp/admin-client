import { ITankerRestock } from "@/definitions/tanker-restock";
import mongoose, { Schema } from "mongoose";

const TankerRestockSchema = new Schema<ITankerRestock>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    quantityAdded: { type: Number, required: true, min: 0 },
    beforeStock: { type: Number, required: true, min: 0 },
    afterStock: { type: Number, required: true, min: 0 },
    expectedClosingBalance: { type: Number, required: true, min: 0 },
    actualMeterReading: { type: Number, required: true, min: 0 },
    variance: { type: Number, required: true },
    variancePercentage: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["completed", "discrepancy"],
      default: "completed",
    },

    // Supplier invoice details
    supplierName: { type: String, trim: true },
    invoiceNumber: { type: String, trim: true, sparse: true },
    invoiceUnitPrice: { type: Number, min: 0 },
    invoiceDate: { type: Date },

    // Pricing details
    gridAtPurchase: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    // Other fields
    notes: { type: String },
    restockDate: { type: Date, default: Date.now },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

TankerRestockSchema.index({ tankerId: 1, restockDate: -1 });

const TankerRestock =
  mongoose.models.TankerRestock ||
  mongoose.model<ITankerRestock>("TankerRestock", TankerRestockSchema);

export default TankerRestock;
