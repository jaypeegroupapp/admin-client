"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import { Types } from "mongoose";
import { CreateOrderInput } from "@/definitions/order";
import mongoose from "mongoose";
import Product from "@/models/product";
import StockMovement from "@/models/stock-movement";

/**
 * ✅ Get all Orders for the logged-in user
 */

export async function getOrdersService(
  page = 0,
  pageSize = 10,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
) {
  await connectDB();

  try {
    const term = search.trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(term);
    const searchRegex = term ? new RegExp(term, "i") : null;

    const match: any = {};

    // STATUS FILTER
    if (status !== "all") {
      match.status = status.toLowerCase();
    }

    // DATE RANGE FILTER
    if (fromDate || toDate) {
      match.createdAt = {};
      if (fromDate) match.createdAt.$gte = new Date(fromDate);
      if (toDate) match.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
    }

    // SEARCH FILTER
    if (term) {
      match.$or = [
        { status: { $regex: searchRegex } },

        isObjectId ? { _id: new mongoose.Types.ObjectId(term) } : null,

        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: term,
              options: "i",
            },
          },
        },
      ].filter(Boolean);
    }

    // MAIN QUERY
    const orders = await Order.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },

      // populate (aggregate)
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "mines",
          localField: "mineId",
          foreignField: "_id",
          as: "mineId",
        },
      },
      { $unwind: { path: "$mineId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "companyId",
        },
      },
      { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productId",
        },
      },
      { $unwind: { path: "$productId", preserveNullAndEmptyArrays: true } },
    ]);

    const totalCount = await Order.countDocuments(match);
    const totalOrders = await Order.countDocuments();

    const statsAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      All: totalOrders,
      Pending: 0,
      Accepted: 0,
      Completed: 0,
      Cancelled: 0,
    };

    statsAgg.forEach((s) => {
      const key = s._id.charAt(0).toUpperCase() + s._id.slice(1);
      if (stats[key as keyof typeof stats] != null)
        stats[key as keyof typeof stats] = s.count;
    });

    return { data: orders, totalCount, stats };
  } catch (error) {
    console.error("❌ getOrdersService error:", error);
    return { data: [], totalCount: 0, stats: {} };
  }
}

/**
 * ✅ Get all Orders for the logged-in user
 */

export async function getOrdersByCompanyIdService(companyId: string) {
  await connectDB();

  try {
    const orders = await Order.find({
      companyId: new Types.ObjectId(companyId),
    })
      .populate("userId", "fullName email")
      .populate("companyId", "companyName")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  } catch (error: any) {
    console.error("❌ getOrdersService error:", error);
    return [];
  }
}

/**
 *
 * @param mineId
 * @returns
 */
export async function getOrdersByMineService(mineId: string) {
  await connectDB();

  try {
    const orders = await Order.find({
      mineId: new Types.ObjectId(mineId),
    })
      .populate("userId", "fullName email")
      .populate("mineId", "name")
      .populate("companyId", "companyName")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("❌ getOrdersByMineService error:", error);
    return [];
  }
}

/**
 * ✅ Get a single Order by ID
 */
export async function getOrderByIdService(id: string) {
  await connectDB();
  const order = (await Order.findById(id)
    .populate("productId")
    .populate("mineId")
    .populate("companyId")
    .populate("userId")
    .lean()) as any;

  if (!order) return null;

  // fetch order items
  const items = (await OrderItem.find({ orderId: id })
    .populate("truckId", "registrationNumber plateNumber")
    .lean()) as any[];

  return {
    ...order,
    id: order._id.toString(),
    items,
  };
}

/**
 * ✅ Get all Orders for the logged-in user
 */

export async function getOrdersByProductIdService(productId: string) {
  await connectDB();

  try {
    const orders = await Order.find({ productId })
      .populate("userId", "fullName email")
      .populate("mineId", "name")
      .populate("companyId", "companyName")
      .populate("productId", "name price")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(orders));
  } catch (error: any) {
    console.error("❌ getOrdersByProductIdService error:", error);
    return [];
  }
}

/**
 * ✅ Create a new Order and associated OrderItems
 */
export async function createOrderService(data: CreateOrderInput) {
  await connectDB();

  const session = await Order.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Create main order
    const [order] = await Order.create(
      [
        {
          userId: new Types.ObjectId(data.userId),
          companyId: new Types.ObjectId(data.companyId),
          productId: new Types.ObjectId(data.productId),
          totalAmount: data.totalAmount,
          collectionDate: new Date(data.collectionDate),
          status: data.status || "pending",
        },
      ],
      { session }
    );

    // 2️⃣ Create related order items
    if (data.items && data.items.length > 0) {
      const orderItems = data.items.map((item) => ({
        orderId: order._id,
        truckId: new Types.ObjectId(item.truckId),
        quantity: item.quantity,
      }));

      await OrderItem.insertMany(orderItems, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true, orderId: order._id.toString() };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ createOrderService error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * 🗑️ Delete an order if it's still pending
 */
export async function deleteOrderService(orderId: string) {
  await connectDB();

  try {
    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (order.status !== "pending") {
      return {
        success: false,
        message: "Only pending orders can be deleted",
      };
    }

    // Delete related order items first
    await OrderItem.deleteMany({ orderId });
    await Order.findByIdAndDelete(orderId);

    return { success: true };
  } catch (error: any) {
    console.error("❌ deleteOrderService error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Updates the collection date for a given order
 */
export async function updateCollectionDateService(
  orderId: string,
  collectionDate: string
) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    return { success: false, message: "Order not found" };
  }

  if (order.status !== "pending") {
    return {
      success: false,
      message: "Only pending orders can be rescheduled",
    };
  }

  order.collectionDate = new Date(collectionDate);
  await order.save();

  return { success: true, message: "Collection date updated successfully" };
}

export async function acceptOrderWithTransaction(
  orderId: string,
  quantity: number
) {
  await connectDB();

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ Get the order
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      await session.abortTransaction();
      return { success: false, message: "Order not found." };
    }

    if (order.status !== "pending") {
      await session.abortTransaction();
      return { success: false, message: "Order already processed." };
    }

    // 2️⃣ Get the product
    const product = await Product.findById(order.productId).session(session);

    if (!product) {
      await session.abortTransaction();
      return { success: false, message: "Product not found." };
    }

    if (product.stock < quantity) {
      await session.abortTransaction();
      return { success: false, message: "Not enough stock available." };
    }

    await OrderItem.updateMany(
      { orderId }, // find all linked to the order
      { $set: { status: "accepted" } },
      { session }
    );

    // 3️⃣ Update Order → accepted
    order.status = "accepted";
    await order.save({ session });

    // 4️⃣ Deduct stock
    product.stock -= quantity;
    await product.save({ session });

    // 5️⃣ Record stock movement (🆕 Added)
    await StockMovement.create(
      [
        {
          productId: product._id,
          type: "OUT",
          quantity: quantity,
          purchasePrice: product.purchasePrice,
          sellingPriceAtPurchase: product.sellingPrice,
          reason: `Order accepted: ${order._id}`,
        },
      ],
      { session }
    );

    // 6️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    console.error("❌ Transaction failed:", error);

    await session.abortTransaction();
    session.endSession();

    return { success: false, message: "Transaction failed." };
  }
}

export async function declineOrderService(orderId: string, reason: string) {
  await connectDB();
  return await Order.findByIdAndUpdate(
    orderId,
    { status: "declined", declineReason: reason },
    { new: true }
  ).lean();
}

// data/services/invoice-orders.service.ts
export async function getInvoiceOrdersService(invoiceId: string) {
  await connectDB();

  // Fetch orders linked to this invoice
  const orders = (await Order.find({ invoiceId })
    .populate("productId")
    .lean()) as any[];

  if (!orders.length) return [];

  // Fetch order items for each order
  const finalOrders = await Promise.all(
    orders.map(async (order: any) => {
      const items = (await OrderItem.find({ orderId: order._id })
        .populate("truckId", "plateNumber registrationNumber")
        .lean()) as any[];

      return {
        ...order,
        id: order._id.toString(),
        items,
      };
    })
  );

  return finalOrders;
}
