import { ICompanyCreditDisableReason } from "@/definitions/company-credit-disable";
import mongoose, { Schema, Model } from "mongoose";
import CompanyCredit from "./company-credit";

type CompanyCreditDisableReasonDocument = Omit<
  ICompanyCreditDisableReason,
  "id" | "companyCreditId"
> & {
  companyCreditId: mongoose.Types.ObjectId;
};

const CompanyCreditDisableReasonSchema =
  new Schema<CompanyCreditDisableReasonDocument>(
    {
      companyCreditId: {
        type: Schema.Types.ObjectId,
        ref: CompanyCredit.modelName,
        required: true,
      },
      requester: {
        type: String,
        enum: ["Transporter", "Business", "Mine"],
        required: true,
      },
      reason: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { timestamps: true },
  );

const CompanyCreditDisableReason: Model<CompanyCreditDisableReasonDocument> =
  mongoose.models.CompanyCreditDisableReason ||
  mongoose.model<CompanyCreditDisableReasonDocument>(
    "CompanyCreditDisableReason",
    CompanyCreditDisableReasonSchema,
  );

export default CompanyCreditDisableReason;
