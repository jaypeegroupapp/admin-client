// models/Truck.ts
import { ITruck } from "@/definitions/truck";
import mongoose, { Schema, Document, Model } from "mongoose";
import User from "./user";
import Company from "./company";

type ITruckDoc = Omit<ITruck, "id" | "userId" | "companyId"> & {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
};

const TruckSchema: Schema<ITruckDoc> = new Schema(
  {
    plateNumber: { type: String, required: true, unique: true, trim: true },
    registrationNumber: {
      type: String,
      trim: true,
    },
    vinNumber: {
      type: String,
      trim: true,
    },
    colour: { type: String },
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    isActive: { type: Boolean, default: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in dev
const Truck: Model<ITruckDoc> =
  (mongoose.models.Truck as Model<ITruckDoc>) ||
  mongoose.model<ITruckDoc>("Truck", TruckSchema);

export default Truck;
