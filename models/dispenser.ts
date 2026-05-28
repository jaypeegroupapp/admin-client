import { IDispenser } from "@/definitions/dispenser";
import mongoose, { Schema, Document } from "mongoose";
import User from "./user";
import Product from "./product";

interface DispenserDocument
  extends Document, Omit<IDispenser, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const DispenserSchema = new Schema<DispenserDocument>(
  {
    name: { type: String, required: true, trim: true },
    productId: {
      type: Schema.Types.ObjectId,
      ref: Product.modelName,
      required: true,
    },
    totalDispensed: { type: Number, default: 0, min: 0 }, // Cumulative dispensed litres
    isPublished: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: false,
    },
  },
  { timestamps: true },
);

DispenserSchema.index({ name: "text" });

const Dispenser =
  mongoose.connection.models.Dispenser ||
  mongoose.model<DispenserDocument>("Dispenser", DispenserSchema);

export default Dispenser;
