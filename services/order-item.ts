import { connectDB } from "@/lib/db";
import OrderItem from "@/models/order-item";
import { Types } from "mongoose";

export async function getOrderItemsByOrderIdService(orderId: string) {
  await connectDB();

  const items = await OrderItem.find({
    orderId: new Types.ObjectId(orderId),
  })
    .populate("truckId", "plateNumber")
    .lean();

  return JSON.parse(JSON.stringify(items));
}
