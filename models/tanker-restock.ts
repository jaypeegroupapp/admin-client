import mongoose, { Schema } from "mongoose";

export interface ITankerRestock {
  tankerId: mongoose.Types.ObjectId;
  quantityAdded: number;
  beforeStock: number;
  afterStock: number;
  supplierName?: string;
  invoiceNumber?: string;
  notes?: string;
  restockDate: Date;
  status: "pending" | "completed";
}

const TankerRestockSchema = new Schema<ITankerRestock>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    quantityAdded: { type: Number, required: true, min: 0 },
    beforeStock: { type: Number, required: true, min: 0 },
    afterStock: { type: Number, required: true, min: 0 },
    supplierName: { type: String },
    invoiceNumber: { type: String },
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

TankerRestockSchema.index({ tankerId: 1, restockDate: -1 });

const TankerRestock =
  mongoose.models.TankerRestock ||
  mongoose.model<ITankerRestock>("TankerRestock", TankerRestockSchema);

export default TankerRestock;
