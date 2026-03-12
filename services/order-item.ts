// src/services/order-item.ts
import { connectDB } from "@/lib/db";
import OrderItem from "@/models/order-item";
import mongoose, { Types } from "mongoose";
import Dispenser from "@/models/dispenser";
import DispenserUsage from "@/models/dispenser-usage";
import DispenserAttendanceRecord from "@/models/dispenser-attendance";
import { getSession } from "@/lib/session";
import Order from "@/models/order";

export async function getOrderItemsService(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = "",
) {
  await connectDB();

  const term = search.trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(term);
  const termRegex = term ? new RegExp(term, "i") : null;

  /** ------------------------------
   * MATCH STAGE
   * ------------------------------*/
  const match: any = {};

  if (status !== "all") match.status = status.toLowerCase();

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) match.createdAt.$lte = new Date(toDate + "T23:59:59.999Z");
  }

  if (term) {
    match.$or = [
      { status: { $regex: termRegex } },
      { "truck.plateNumber": { $regex: termRegex } },
      { "company.name": { $regex: termRegex } },
      { "product.name": { $regex: termRegex } },

      // full ObjectId
      isObjectId ? { _id: new mongoose.Types.ObjectId(term) } : null,

      // ObjectId suffix search
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

  /** ------------------------------
   * AGGREGATE
   * ------------------------------*/
  const data = await OrderItem.aggregate([
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truck",
      },
    },
    { $unwind: { path: "$truck", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "companies",
        localField: "order.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "products",
        localField: "order.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

    { $match: match },
    { $sort: { createdAt: -1 } },
    { $skip: page * pageSize },
    { $limit: pageSize },
  ]);

  const totalCount = await OrderItem.countDocuments(match);

  /** Stats */
  const statsAgg = await OrderItem.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const stats = {
    All: await OrderItem.countDocuments(),
    Pending: 0,
    Accepted: 0,
    Completed: 0,
    Cancelled: 0,
  };

  statsAgg.forEach((s) => {
    if (s._id) {
      const key = s._id.charAt(0).toUpperCase() + s._id.slice(1);
      if (stats[key as keyof typeof stats] !== undefined)
        stats[key as keyof typeof stats] = s.count;
    }
  });

  return { data, totalCount, stats };
}

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

export async function getAllOrderItemsService() {
  await connectDB();

  const agg = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truck",
      },
    },
    { $unwind: "$truck" },

    {
      $lookup: {
        from: "companies",
        localField: "order.companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "order.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        orderId: "$order._id",
        productId: "$product._id",
        companyId: "$order.companyId",

        quantity: 1,
        status: 1,
        signature: 1,

        truckId: "$truck._id",
        plateNumber: "$truck.plateNumber",
        make: "$truck.make",
        model: "$truck.model",
        year: "$truck.year",

        companyName: "$company.name",
        productName: "$product.name",
      },
    },
  ]);

  return JSON.parse(JSON.stringify(agg));
}

/* export async function completeOrderItem(itemId: string, signature?: string) {
  await connectDB();

  try {
    const item = await OrderItem.findById(itemId);

    if (!item) {
      return { success: false, message: "Order item not found." };
    }

    // Don't allow re-completion
    if (item.status === "completed") {
      return { success: false, message: "Order item already completed." };
    }

    item.status = "completed";

    if (signature) {
      item.signature = signature; // base64 PNG
    }

    await item.save();

    // Return the fully populated order item

    return {
      success: true,
    };
  } catch (error) {
    console.error("❌ completeOrderItem service error:", error);
    return { success: false, message: "Failed to complete order item." };
  }
} */

// Alternative approach using findByIdAndUpdate
export async function completeOrderItem(itemId: string, signature?: string) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get current user from session
    const userSession = (await getSession()) as any;
    if (!userSession?.user?.id) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "User not authenticated" };
    }

    // Get the order item (read-only)
    const item = await OrderItem.findById(itemId)
      .populate("orderId")
      .populate("productId")
      .session(session);

    if (!item) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Order item not found." };
    }

    if (item.status === "completed") {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "Order item already completed." };
    }

    // Find dispenser assigned to current user
    const dispenser = await Dispenser.findOne({
      userId: new mongoose.Types.ObjectId(userSession.user.id),
      isPublished: true,
    }).session(session);

    if (!dispenser) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "No dispenser assigned to you. Please contact your manager.",
      };
    }

    // Find active attendance
    const attendance = await DispenserAttendanceRecord.findOne({
      userId: new mongoose.Types.ObjectId(userSession.user.id),
      dispenserId: dispenser._id,
      status: "active",
    }).session(session);

    if (!attendance) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "You are not logged into this dispenser. Please log in first.",
      };
    }

    // Check stock
    const quantity = item.quantity || 0;
    if (dispenser.litres < quantity) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: `Insufficient stock. Available: ${dispenser.litres}L, Required: ${quantity}L`,
      };
    }

    // Update order item using findByIdAndUpdate (bypasses validation)
    await OrderItem.findByIdAndUpdate(
      itemId,
      {
        status: "completed",
        dispenserId: dispenser._id,
        attendanceId: attendance._id,
        ...(signature && { signature }),
      },
      { session, runValidators: false }, // Disable validators to avoid price/productId validation
    );

    // Update order status
    const order = item.orderId as any;
    const orderItems = await OrderItem.find({ orderId: order._id }).session(
      session,
    );
    const allCompleted = orderItems.every((i) => i.status === "completed");

    if (allCompleted) {
      await Order.findByIdAndUpdate(
        order._id,
        { status: "completed" },
        { session },
      );
    }

    // Update dispenser stock
    const balanceBefore = dispenser.litres;
    const balanceAfter = balanceBefore - quantity;

    await Dispenser.findByIdAndUpdate(
      dispenser._id,
      {
        litres: balanceAfter,
        lastReading: balanceAfter,
        lastReadingDate: new Date(),
      },
      { session },
    );

    // Create dispenser usage record
    await DispenserUsage.create(
      [
        {
          dispenserId: dispenser._id,
          litresDispensed: quantity,
          timestamp: new Date(),
          orderId: order._id,
          orderItemId: item._id,
          attendanceId: attendance._id,
          balanceBefore,
          balanceAfter,
        },
      ],
      { session },
    );

    // Update attendance record
    await DispenserAttendanceRecord.findByIdAndUpdate(
      attendance._id,
      {
        $inc: { totalDispensed: quantity },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Order completed successfully",
      data: {
        dispenserName: dispenser.name,
        litresBefore: balanceBefore,
        litresAfter: balanceAfter,
        litresSold: quantity,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ completeOrderItem error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to complete order.",
    };
  }
}
