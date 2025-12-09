// models/company-credit-trail.ts
import mongoose, { Schema, Model } from "mongoose";
import Company from "./company";
import Mine from "./mine";
import { IAccountStatementTrail } from "@/definitions/account-statement-trail";

type AccountStatementTrailDocument = Omit<
  IAccountStatementTrail,
  "id" | "companyId" | "mineId"
> & {
  companyId: mongoose.Types.ObjectId;
  mineId: mongoose.Types.ObjectId;
};

const AccountStatementTrailSchema = new Schema<AccountStatementTrailDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: Company.modelName,
      required: true,
    },
    mineId: {
      type: Schema.Types.ObjectId,
      ref: Mine.modelName,
      required: false,
    },
    type: {
      type: String,
      enum: [
        "debit-added",
        "credit-updated",
        "order-debit",
        "invoice-payment",
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

const AccountStatementTrail: Model<AccountStatementTrailDocument> =
  mongoose.models.AccountStatementTrail ||
  mongoose.model<AccountStatementTrailDocument>(
    "AccountStatementTrail",
    AccountStatementTrailSchema
  );

export default AccountStatementTrail;
