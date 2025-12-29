import mongoose, { Schema, Model } from "mongoose";
import { IRole } from "@/definitions/role";

type IRoleDoc = Omit<IRole, "id">;

const RoleSchema = new Schema<IRoleDoc>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
  },
  { timestamps: true }
);

const Role: Model<IRoleDoc> =
  mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;
