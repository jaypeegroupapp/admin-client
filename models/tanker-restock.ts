import { ITankerRestock } from "@/definitions/tanker-restock";
import mongoose, { Schema } from "mongoose";

const TankerRestockSchema = new Schema<ITankerRestock>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    quantityAdded: { type: Number, required: true, min: 0 },
    beforeStock: { type: Number, required: true, min: 0 },
    afterStock: { type: Number, required: true, min: 0 },

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
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

// Indexes for efficient querying
TankerRestockSchema.index({ tankerId: 1, restockDate: -1 });
TankerRestockSchema.index({ invoiceNumber: 1 }, { sparse: true });
TankerRestockSchema.index({ supplierName: 1 });

const TankerRestock =
  mongoose.models.TankerRestock ||
  mongoose.model<ITankerRestock>("TankerRestock", TankerRestockSchema);

export default TankerRestock;
