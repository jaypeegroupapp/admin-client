import mongoose, { Schema, Model, Types } from "mongoose";
import { IRole } from "@/definitions/role";
import Action from "./action";

type IRoleDoc = Omit<IRole, "id"> & {
  actions: Types.ObjectId[];
};

const RoleSchema = new Schema<IRoleDoc>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    actions: [
      {
        type: Schema.Types.Mixed, // allows ObjectId OR "*"
        ref: Action.modelName,
      },
    ],
  },
  { timestamps: true }
);

const Role: Model<IRoleDoc> =
  mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;
