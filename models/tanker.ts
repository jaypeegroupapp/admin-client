import { ITanker } from "@/definitions/tanker";
import mongoose, { Schema, Document, Types } from "mongoose";
import User from "./user";
import Product from "./product";

interface TankerDocument
  extends Document, Omit<ITanker, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const TankerSchema = new Schema<TankerDocument>(
  {
    name: { type: String, required: true, trim: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: Product.modelName,
      required: true,
    },
    stockLevel: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: false,
    },
  },
  { timestamps: true },
);

TankerSchema.index({ name: "text" });

const Tanker =
  mongoose.connection.models.Tanker ||
  mongoose.model<TankerDocument>("Tanker", TankerSchema);

export default Tanker;
