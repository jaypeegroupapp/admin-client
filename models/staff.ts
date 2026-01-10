// models/staff.ts
import mongoose, { Schema, Model } from "mongoose";
import User from "./user";
import Mine from "./mine";
import { IStaff } from "@/definitions/staff";

type IStaffDoc = Omit<IStaff, "id" | "userId" | "mines"> & {
  userId: mongoose.Types.ObjectId;
  mines: mongoose.Types.ObjectId[];
};

const StaffSchema: Schema<IStaffDoc> = new Schema(
  {
    name: { type: String, required: true },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      unique: true,
    },

    mines: [
      {
        type: Schema.Types.Mixed, // ⬅ allow "*" OR ObjectId
        ref: Mine.modelName,
      },
    ],
  },
  { timestamps: true }
);

const Staff: Model<IStaffDoc> =
  (mongoose.models.Staff as Model<IStaffDoc>) ||
  mongoose.model<IStaffDoc>("Staff", StaffSchema);

export default Staff;
