import { IOrder } from "@/definitions/order";
import mongoose, { Schema, Model, Types } from "mongoose";
import User from "./user";
import Company from "./company";
import Product from "./product";
import CompanyInvoice from "./company-invoice";
import Mine from "./mine";

type IOrderDoc = Omit<
  IOrder,
  | "id"
  | "userId"
  | "mineId"
  | "companyId"
  | "productId"
  | "invoiceId"
  | "collectionDate"
  | "createdAt"
  | "updatedAt"
> & {
  userId: Types.ObjectId;
  mineId: Types.ObjectId;
  companyId: Types.ObjectId;
  productId: Types.ObjectId;
  invoiceId: Types.ObjectId;
  collectionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const OrderSchema = new Schema<IOrderDoc>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: Company.modelName,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    mineId: {
      type: Schema.Types.ObjectId,
      ref: Mine.modelName,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: Product.modelName,
      required: true,
    },
    purchasePrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: CompanyInvoice.modelName,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "restock", "cancelled"],
      default: "pending",
    },
    reason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev mode
const Order: Model<IOrderDoc> =
  (mongoose.models.Order as Model<IOrderDoc>) ||
  mongoose.model<IOrderDoc>("Order", OrderSchema);

export default Order;
