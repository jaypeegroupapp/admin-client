import { connectDB } from "@/lib/db";
import OrderItem from "@/models/order-item";
import mongoose, { Types } from "mongoose";

export async function getOrderItemsByOrderIdService(orderId: string) {
  await connectDB();

  const items = await OrderItem.find({
    orderId: new Types.ObjectId(orderId),
  })
    .populate("truckId", "plateNumber")
    .lean();

  return JSON.parse(JSON.stringify(items));
}

export async function getTotalQuantityForProductService(productId: string) {
  const quantityObj = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // Filter by productId AND pending status
    {
      $match: {
        "order.productId": new mongoose.Types.ObjectId(productId),
        "order.status": "pending",
      },
    },

    // Sum quantity of all items for this product
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$quantity" },
      },
    },
  ]);
  return quantityObj[0]?.totalQuantity || 0;
}
