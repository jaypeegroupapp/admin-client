import { IMineInvoice } from "@/definitions/mine-invoice";
import mongoose, { Schema, Model } from "mongoose";
import Mine from "./mine";
import Company from "./company";

type IMineInvoiceDoc = Omit<IMineInvoice, "id" | "mineId" | "companyId"> & {
  mineId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
};

const MineInvoiceSchema: Schema<IMineInvoiceDoc> = new Schema(
  {
    mineId: {
      type: Schema.Types.ObjectId,
      ref: Mine.modelName,
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: Company.modelName,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "published", "paid", "closed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    closingBalance: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite in dev hot reload
const MineInvoice: Model<IMineInvoiceDoc> =
  (mongoose.models.MineInvoice as Model<IMineInvoiceDoc>) ||
  mongoose.model<IMineInvoiceDoc>("MineInvoice", MineInvoiceSchema);

export default MineInvoice;
