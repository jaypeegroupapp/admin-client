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
    meterVariance: { type: Number, required: true },
    meterVariancePercentage: { type: Number, required: true, default: 0 },

    // Manual dipping reading fields
    manualDippingReading: { type: Number, required: true, min: 0 },
    dippingVariance: { type: Number, required: true },
    dippingVariancePercentage: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: ["completed", "discrepancy"],
      default: "completed",
    },

    // Supplier invoice details
    supplierName: { type: String, trim: true, required: true },
    invoiceNumber: { type: String, trim: true, sparse: true, required: true },
    invoiceUnitPrice: { type: Number, min: 0, required: true },
    invoiceDate: { type: Date, required: true },

    // Pricing details
    gridAtPurchase: { type: Number, min: 0, required: true },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    // Other fields
    notes: { type: String },
    restockDate: { type: Date, default: Date.now, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

TankerRestockSchema.index({ tankerId: 1, restockDate: -1 });

const TankerRestock =
  mongoose.models.TankerRestock ||
  mongoose.model<ITankerRestock>("TankerRestock", TankerRestockSchema);

export default TankerRestock;
