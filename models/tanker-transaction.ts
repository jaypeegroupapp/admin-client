import mongoose, { Schema } from "mongoose";

export interface ITankerTransaction {
  tankerId: mongoose.Types.ObjectId;
  type: "RESTOCK" | "TRANSFER_OUT" | "SPILLAGE";
  quantity: number;
  beforeStock: number;
  afterStock: number;
  details?: Record<string, any>;
  timestamp: Date;
}

const TankerTransactionSchema = new Schema<ITankerTransaction>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    type: {
      type: String,
      enum: ["RESTOCK", "TRANSFER_OUT", "SPILLAGE"],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    beforeStock: { type: Number, required: true, min: 0 },
    afterStock: { type: Number, required: true, min: 0 },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

TankerTransactionSchema.index({ tankerId: 1, timestamp: -1 });
TankerTransactionSchema.index({ type: 1 });

const TankerTransaction =
  mongoose.models.TankerTransaction ||
  mongoose.model<ITankerTransaction>(
    "TankerTransaction",
    TankerTransactionSchema,
  );

export default TankerTransaction;
