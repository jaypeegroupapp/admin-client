import { ICompanyInvoice } from "@/definitions/company-invoice";
import mongoose, { Schema, Model } from "mongoose";
import Company from "./company";

type ICompanyInvoiceDoc = Omit<ICompanyInvoice, "id" | "companyId"> & {
  companyId: mongoose.Types.ObjectId;
};

const CompanyInvoiceSchema: Schema<ICompanyInvoiceDoc> = new Schema(
  {
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

    paymentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev hot reload
const CompanyInvoice: Model<ICompanyInvoiceDoc> =
  (mongoose.models.CompanyInvoice as Model<ICompanyInvoiceDoc>) ||
  mongoose.model<ICompanyInvoiceDoc>("CompanyInvoice", CompanyInvoiceSchema);

export default CompanyInvoice;
