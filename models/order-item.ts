// src/models/order-item.ts
import { IOrderItem } from "@/definitions/order-item";
import mongoose, { Schema, Types } from "mongoose";
import Truck from "./truck";
import Order from "./order";
import Product from "./product";
import Dispenser from "./dispenser";
import User from "./user";
import DispenserAttendanceRecord from "./dispenser-attendance";

type IOrderItemDoc = Omit<IOrderItem, "id" | "orderId" | "truckId"> & {
  orderId: Types.ObjectId;
  truckId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

const OrderItemSchema = new Schema<IOrderItemDoc>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: Order.modelName, required: true },
    truckId: {
      type: Schema.Types.ObjectId,
      ref: Truck.modelName,
      required: true,
    },
    productId: { type: Schema.Types.ObjectId, ref: Product.modelName },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled", "returned", "closed"],
      default: "pending",
    },
    signature: { type: String },
    dispenserId: { type: Schema.Types.ObjectId, ref: Dispenser.modelName }, // Add this
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: DispenserAttendanceRecord.modelName,
    },
    // Return fields
    isReturned: { type: Boolean, default: false },
    returnedAt: { type: Date },
    returnedReason: { type: String },
    returnedBy: { type: Schema.Types.ObjectId, ref: User.modelName },
    // Closed fields (simplified)
    closedAt: { type: Date },
    closedBy: { type: Schema.Types.ObjectId, ref: User.modelName },
  },
  { timestamps: true },
);

// Indexes
OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ truckId: 1 });
OrderItemSchema.index({ status: 1 });
OrderItemSchema.index({ isReturned: 1 });

// Virtual for total price
OrderItemSchema.virtual("totalPrice").get(function () {
  return this.quantity * this.price;
});

OrderItemSchema.set("toJSON", { virtuals: true });
OrderItemSchema.set("toObject", { virtuals: true });

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItemSchema);