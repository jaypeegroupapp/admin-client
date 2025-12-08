// models/company-credit.ts
import { ICompanyCredit } from "@/definitions/company-credit";
import mongoose, { Schema, Model } from "mongoose";
import Company from "./company";
import Mine from "./mine";

type CompanyCreditDocument = Omit<
  ICompanyCredit,
  "id" | "companyId" | "mineId"
> & {
  companyId: mongoose.Types.ObjectId;
  mineId: mongoose.Types.ObjectId;
};

const CompanyCreditSchema = new Schema<CompanyCreditDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: Company.modelName,
      required: true,
    },
    mineId: {
      type: Schema.Types.ObjectId,
      ref: Mine.modelName,
      required: true,
    },
    creditLimit: { type: Number, required: true, default: 0 },
    usedCredit: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const CompanyCredit: Model<CompanyCreditDocument> =
  mongoose.models.CompanyCredit ||
  mongoose.model<CompanyCreditDocument>("CompanyCredit", CompanyCreditSchema);

export default CompanyCredit;
