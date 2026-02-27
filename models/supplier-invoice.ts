// models/supplier-invoice.ts
import mongoose, { Schema, Model, Types } from "mongoose";
import { ISupplierInvoice } from "@/definitions/supplier-invoice";
import StockMovement from "./stock-movement";

export interface ISupplierInvoiceDocument
  extends
    Document,
    Omit<ISupplierInvoice, "id" | "stockMovementId" | "invoiceDate"> {
  stockMovementId: Types.ObjectId;
  invoiceDate: Date;
}

const SupplierInvoiceSchema = new Schema<ISupplierInvoiceDocument>(
  {
    name: { type: String, required: true, trim: true },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceUnitPrice: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    invoiceDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "closed"],
      default: "pending",
    },
    paymentDate: { type: Date },
    stockMovementId: {
      type: Schema.Types.ObjectId,
      ref: StockMovement.modelName,
      required: true,
    },
  },
  { timestamps: true },
);

const SupplierInvoice: Model<ISupplierInvoiceDocument> =
  mongoose.models.SupplierInvoice ||
  mongoose.model<ISupplierInvoiceDocument>(
    "SupplierInvoice",
    SupplierInvoiceSchema,
  );

export default SupplierInvoice;
