import mongoose, { Schema, Document, Model } from "mongoose";
import { ICompany } from "@/definitions/company";
import User from "./user";

interface CompanyDocument extends Document, Omit<ICompany, "id" | "userId"> {
  userId: mongoose.Types.ObjectId;
}

const CompanySchema = new Schema<CompanyDocument>(
  {
    companyName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    billingAddress: { type: String, required: true, trim: true },
    vatNumber: { type: String, trim: true },
    invoiceFile: { type: String, trim: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    debitAmount: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

// ✅ Index to enable fast searching by companyName or registrationNumber
CompanySchema.index({ companyName: "text", registrationNumber: "text" });

const Company: Model<CompanyDocument> =
  mongoose.models.Company ||
  mongoose.model<CompanyDocument>("Company", CompanySchema);

export default Company;
