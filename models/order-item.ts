import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Order from "./order";
import Truck from "./truck";
import { IOrderItem } from "@/definitions/order-item";

type IOrderItemDoc = Omit<IOrderItem, "id" | "orderId" | "truckId"> & {
  orderId: Types.ObjectId;
  truckId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const OrderItemSchema = new Schema<IOrderItemDoc>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: Order.modelName,
      required: true,
    },
    truckId: {
      type: Schema.Types.ObjectId,
      ref: Truck.modelName,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    signature: { type: String, required: false }, // base64 PNG
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "restock", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const OrderItem: Model<IOrderItemDoc> =
  (mongoose.models.OrderItem as Model<IOrderItemDoc>) ||
  mongoose.model<IOrderItemDoc>("OrderItem", OrderItemSchema);

export default OrderItem;
