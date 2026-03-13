// src/models/order-item.ts
import { IOrderItem } from "@/definitions/order-item";
import mongoose, { Schema, Document, Types } from "mongoose";
import Truck from "./truck";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    truckId: {
      type: Schema.Types.ObjectId,
      ref: Truck.modelName,
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    signature: { type: String },
    dispenserId: { type: Schema.Types.ObjectId, ref: "Dispenser" }, // Add this
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "DispenserAttendanceRecord",
    }, // Add this
  },
  { timestamps: true },
);

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema);
