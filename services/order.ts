"use server";

import { connectDB } from "@/lib/db";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import { Types } from "mongoose";
import { CreateOrderInput } from "@/definitions/order";
import mongoose from "mongoose";
import Tanker from "@/models/tanker";

/**
 * ✅ Get all Orders for the logged-in user
 */

export async function getOrdersService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = "",
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
      .populate("companyId", "name")
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
      .populate("companyId", "name")
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
// src/services/order.ts
export async function getOrderByIdService(id: string) {
  await connectDB();

  // Fetch the order
  const order = (await Order.findById(id)
    .populate("productId", "name price description")
    .populate("mineId", "name location")
    .populate("companyId", "name email phone address")
    .populate("userId", "name email")
    .populate("invoiceId", "invoiceNumber totalAmount status")
    .lean()) as any;

  if (!order) return null;

  // Fetch order items
  const items = (await OrderItem.find({
    orderId: new mongoose.Types.ObjectId(id),
  })
    .populate(
      "truckId",
      "plateNumber make model year companyName registrationNumber",
    )
    .populate("productId", "name price")
    .populate("dispenserId", "name litres")
    .populate({
      path: "attendanceId",
      select: "loginTime logoutTime",
      populate: {
        path: "attendantId",
        populate: {
          path: "userId",
          select: "name email",
        },
      },
    })
    .sort({ createdAt: -1 })
    .lean()) as any[];

  // Format the order with items
  return {
    id: order._id.toString(),
    orderNumber:
      order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
    companyId: order.companyId?._id?.toString(),
    company: order.companyId,
    userId: order.userId?._id?.toString(),
    user: order.userId,
    mineId: order.mineId?._id?.toString(),
    mine: order.mineId,
    productId: order.productId?._id?.toString(),
    product: order.productId,
    invoiceId: order.invoiceId?._id?.toString(),
    invoice: order.invoiceId,
    purchasePrice: order.purchasePrice,
    grid: order.grid,
    totalAmount: order.totalAmount,
    collectionDate: order.collectionDate,
    status: order.status,
    reason: order.reason,
    signature: order.signature,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: items.map((item: any) => ({
      id: item._id.toString(),
      orderId: item.orderId.toString(),
      truckId: item.truckId?._id?.toString(),
      truck: item.truckId,
      productId: item.productId?._id?.toString(),
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      status: item.status,
      signature: item.signature,
      dispenserId: item.dispenserId?._id?.toString(),
      dispenser: item.dispenserId,
      attendanceId: item.attendanceId?._id?.toString(),
      attendance: item.attendanceId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
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
      .populate("companyId", "name")
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
      { session },
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
  collectionDate: string,
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

export async function acceptOrderService(orderId: string, quantity: number) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error("Order already processed");
  }

  // Check available stock before accepting
  const stockInfo = await getAvailableStockForProductService(
    order.productId.toString(),
  );

  if (stockInfo.availableStock < quantity) {
    throw new Error(
      `Insufficient stock. Available: ${stockInfo.availableStock}L, Required: ${quantity}L. Shortfall: ${quantity - stockInfo.availableStock}L.`,
    );
  }

  // Update Order Items to accepted
  await OrderItem.updateMany({ orderId }, { $set: { status: "accepted" } });

  // Update Order to accepted
  order.status = "accepted";
  await order.save();

  return order;
}

export async function declineOrderService(orderId: string, reason: string) {
  await connectDB();

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "pending") {
    throw new Error("Cannot decline order that is already processed");
  }

  order.status = "cancelled";
  order.reason = reason;
  await order.save();

  return order;
}
// data/services/invoice-orders.service.ts
export async function getInvoiceOrdersService(invoiceId: string) {
  await connectDB();

  // Fetch orders linked to this invoice
  const orders = (await Order.find({ invoiceId })
    .populate("productId")
    .populate("mineId")
    .populate("companyId")
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
    }),
  );

  return finalOrders;
}

export async function getMineInvoiceOrdersService(invoiceId: string) {
  await connectDB();

  const results = await OrderItem.aggregate([
    // 1️⃣ Join Orders
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // 2️⃣ Filter by invoiceId
    {
      $match: {
        "order.invoiceId": new Types.ObjectId(invoiceId),
      },
    },

    // 3️⃣ Join Trucks
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truck",
      },
    },
    { $unwind: "$truck" },

    // 4️⃣ Final Shape
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        orderId: { $toString: "$orderId" },
        updateDate: "$updatedAt",
        quantity: "$quantity",
        grid: "$order.grid",
        truckId: {
          name: {
            $cond: [
              {
                $and: [
                  { $ifNull: ["$truck.make", false] },
                  { $ifNull: ["$truck.model", false] },
                ],
              },
              { $concat: ["$truck.make", " ", "$truck.model"] },
              "$truck.plateNumber",
            ],
          },
          plateNumber: "$truck.plateNumber",
          registrationNumber: "$truck.registrationNumber",
        },
      },
    },

    // 5️⃣ Sort newest first
    {
      $sort: { updateDate: -1 },
    },
  ]);

  return results;
}

export async function getAvailableStockForProductService(productId: string) {
  await connectDB();

  // Get total tanker stock for this product
  const tankerStockResult = await Tanker.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(productId),
        isPublished: true,
      },
    },
    {
      $group: {
        _id: null,
        totalStock: { $sum: "$stockLevel" },
      },
    },
  ]);

  const totalTankerStock = tankerStockResult[0]?.totalStock || 0;

  // Get total accepted order quantity for this product
  const acceptedOrdersResult = await Order.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(productId),
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "orderitems",
        localField: "_id",
        foreignField: "orderId",
        as: "items",
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalAccepted: { $sum: "$items.quantity" },
      },
    },
  ]);

  const totalAccepted = acceptedOrdersResult[0]?.totalAccepted || 0;

  // Available stock = physical stock - reserved (accepted orders)
  const availableStock = totalTankerStock - totalAccepted;

  return {
    totalTankerStock,
    totalAccepted,
    availableStock: Math.max(0, availableStock),
  };
}
