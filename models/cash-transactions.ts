import mongoose, { Schema, Model } from "mongoose";
import { ICashTransaction } from "@/definitions/cash-transactions";

type ICashTransactionDoc = Omit<ICashTransaction, "id">;

const CashTransactionSchema: Schema<ICashTransactionDoc> = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    plateNumber: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    litresPurchased: {
      type: Number,
      required: true,
      min: 0,
    },

    driverName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    grid: {
      type: Number,
      required: true,
      min: 0,
    },

    plusDiscount: {
      type: Number,
      required: true,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
      index: true,
    },
  },
  { timestamps: true },
);

/**
 * Automatically calculate total before validation
 */
CashTransactionSchema.pre("validate", function (next) {
  const doc = this as ICashTransactionDoc;

  doc.total = doc.litresPurchased * (doc.grid + doc.plusDiscount);

  next();
});

const CashTransaction: Model<ICashTransactionDoc> =
  (mongoose.models.CashTransaction as Model<ICashTransactionDoc>) ||
  mongoose.model<ICashTransactionDoc>("CashTransaction", CashTransactionSchema);

export default CashTransaction;
