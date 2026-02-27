import { IStockMovement } from "@/definitions/stock-movement";
import mongoose, { Schema, Model } from "mongoose";
import Product from "./product";
import { ADDEDSTOCK } from "@/constants/stock-movement";

const StockMovementSchema = new Schema<IStockMovement>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: Product.modelName,
      required: true,
    },
    type: { type: String, enum: [ADDEDSTOCK, "OUT"], required: true },
    quantity: { type: Number, required: true, min: 1 },
    purchasePrice: { type: Number, required: false, default: 0 },
    gridAtPurchase: { type: Number, default: 0 },
    reason: { type: String, trim: true },
  },
  { timestamps: true },
);

const StockMovement: Model<IStockMovement> =
  mongoose.models.StockMovement ||
  mongoose.model<IStockMovement>("StockMovement", StockMovementSchema);

export default StockMovement;
