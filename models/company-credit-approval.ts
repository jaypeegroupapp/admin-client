// models/company-credit-approval.ts
import { ICompanyCreditApproval } from "@/definitions/company-credit-approval";
import mongoose, { Schema, Model } from "mongoose";
import CompanyCredit from "./company-credit";

type CompanyCreditApprovalDocument = Omit<
  ICompanyCreditApproval,
  "id" | "companyCreditId"
> & {
  companyCreditId: mongoose.Types.ObjectId;
};

const CompanyCreditApprovalSchema = new Schema<CompanyCreditApprovalDocument>(
  {
    companyCreditId: {
      type: Schema.Types.ObjectId,
      ref: CompanyCredit.modelName,
      required: true,
    },
    creditLimit: { type: Number, required: true },
    requester: {
      type: String,
      enum: ["Transporter", "Business", "Mine"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    reason: { type: String, required: true, trim: true },
    declinedReason: { type: String, trim: true },
    document: { type: String },
  },
  { timestamps: true }
);

const CompanyCreditApproval: Model<CompanyCreditApprovalDocument> =
  mongoose.models.CompanyCreditApproval ||
  mongoose.model<CompanyCreditApprovalDocument>(
    "CompanyCreditApproval",
    CompanyCreditApprovalSchema
  );

export default CompanyCreditApproval;
