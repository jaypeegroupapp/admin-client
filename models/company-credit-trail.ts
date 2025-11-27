// models/company-credit-trail.ts
import { ICompanyCreditTrail } from "@/definitions/company-credit-trail";
import mongoose, { Schema, Model } from "mongoose";
import Company from "./company";

type CompanyCreditTrailDocument = Omit<
  ICompanyCreditTrail,
  "id" | "companyId"
> & {
  companyId: mongoose.Types.ObjectId;
};

const CompanyCreditTrailSchema = new Schema<CompanyCreditTrailDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: Company.modelName,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "credit-updated",
        "order-debit",
        "invoice-paid",
        "admin-adjustment",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    oldBalance: { type: Number, required: true },
    newBalance: { type: Number, required: true },
    description: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const CompanyCreditTrail: Model<CompanyCreditTrailDocument> =
  mongoose.models.CompanyCreditTrail ||
  mongoose.model<CompanyCreditTrailDocument>(
    "CompanyCreditTrail",
    CompanyCreditTrailSchema
  );

export default CompanyCreditTrail;
