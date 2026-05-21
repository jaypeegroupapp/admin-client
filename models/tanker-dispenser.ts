import mongoose, { Schema } from "mongoose";

export interface ITankerDispenser {
  tankerId: mongoose.Types.ObjectId;
  dispenserId: mongoose.Types.ObjectId;
  isActive: boolean;
  connectedAt: Date;
  disconnectedAt?: Date;
}

const TankerDispenserSchema = new Schema<ITankerDispenser>(
  {
    tankerId: { type: Schema.Types.ObjectId, ref: "Tanker", required: true },
    dispenserId: {
      type: Schema.Types.ObjectId,
      ref: "Dispenser",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    connectedAt: { type: Date, default: Date.now },
    disconnectedAt: { type: Date },
  },
  { timestamps: true },
);

TankerDispenserSchema.index({ tankerId: 1, dispenserId: 1 }, { unique: true });
TankerDispenserSchema.index({ dispenserId: 1, isActive: 1 });

const TankerDispenser =
  mongoose.models.TankerDispenser ||
  mongoose.model<ITankerDispenser>("TankerDispenser", TankerDispenserSchema);

export default TankerDispenser;
