import mongoose, { Schema, Model } from "mongoose";
import { IAction } from "@/definitions/action";

type IActionDoc = Omit<IAction, "id">;

const ActionSchema: Schema<IActionDoc> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Action: Model<IActionDoc> =
  (mongoose.models.Action as Model<IActionDoc>) ||
  mongoose.model<IActionDoc>("Action", ActionSchema);

export default Action;
