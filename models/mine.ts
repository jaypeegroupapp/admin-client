import { IMine } from "@/definitions/mine";
import mongoose, { Schema, Document } from "mongoose";

interface MineDocument
  extends Document,
    Omit<IMine, "id" | "createdAt" | "updatedAt"> {
  createdAt?: Date;
  updatedAt?: Date;
}

const MineSchema = new Schema<MineDocument>(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

MineSchema.index({ name: "text" });

const Mine =
  mongoose.connection.models.Mine ||
  mongoose.model<MineDocument>("Mine", MineSchema);

export default Mine;
