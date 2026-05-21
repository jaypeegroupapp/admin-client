import mongoose, { Schema } from "mongoose";

export interface ITankerSpillage {
  tankerId: mongoose.Types.ObjectId;
  quantity: number;
  type: "TRANSFER" | "STORAGE" | "HANDLING";
  reason: string;
  estimatedCost?: number;
  notes?: string;
  spillageDate: Date;
}

const TankerSpillageSchema = new Schema<ITankerSpillage>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    quantity: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["TRANSFER", "STORAGE", "HANDLING"],
      required: true,
    },
    reason: { type: String, required: true },
    estimatedCost: { type: Number, min: 0 },
    notes: { type: String },
    spillageDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

TankerSpillageSchema.index({ tankerId: 1, spillageDate: -1 });

const TankerSpillage =
  mongoose.models.TankerSpillage ||
  mongoose.model<ITankerSpillage>("TankerSpillage", TankerSpillageSchema);

export default TankerSpillage;
