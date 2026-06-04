// src/services/order-item.ts
import { connectDB } from "@/lib/db";
import OrderItem from "@/models/order-item";
import mongoose, { Types } from "mongoose";
import Dispenser from "@/models/dispenser";
import DispenserUsage from "@/models/dispenser-usage";
import DispenserAttendanceRecord from "@/models/dispenser-attendance";
import { getSession } from "@/lib/session";
import Order from "@/models/order";
import TankerTransaction from "@/models/tanker-transaction";
import Tanker from "@/models/tanker";
import TankerDispenser from "@/models/tanker-dispenser";

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
  // console.log("🚀 Fetched order items:", { data, totalCount, stats });

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

// src/services/order-item.ts (updated completeOrderItem)
export async function completeOrderItem(itemId: string, signature?: string) {
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userSession = (await getSession()) as any;
    if (!userSession?.user?.id) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: "User not authenticated" };
    }

    const item = await OrderItem.findById(itemId)
      .populate({ path: "orderId" })
      .populate("productId")
      .populate("truckId", "plateNumber make model")
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

    // Find active attendance with full population
    const attendance = await DispenserAttendanceRecord.findOne({
      userId: new mongoose.Types.ObjectId(userSession.user.id),
      dispenserId: dispenser._id,
      status: "active",
    })
      .populate({
        path: "attendantId",
        select: "name",
      })
      .populate("dispenserId", "name")
      .session(session);

    if (!attendance) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "You are not logged into this dispenser. Please log in first.",
      };
    }

    // Extract attendant name from populated data
    const attendantName = attendance.attendantId
      ? attendance.attendantId.name
      : "Unknown Attendant";

    // Find the tanker connected to this dispenser
    const tankerConnection = await TankerDispenser.findOne({
      dispenserId: dispenser._id,
      isActive: true,
    }).session(session);

    if (!tankerConnection) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message:
          "No tanker connected to this dispenser. Please contact your manager.",
      };
    }

    // Get the tanker
    const tanker = await Tanker.findById(tankerConnection.tankerId).session(
      session,
    );
    if (!tanker) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: "Connected tanker not found.",
      };
    }

    const quantity = item.quantity || 0;

    // Check if tanker has enough stock
    if (tanker.stockLevel < quantity) {
      await session.abortTransaction();
      session.endSession();
      return {
        success: false,
        message: `Insufficient stock in tanker. Available: ${tanker.stockLevel}L, Required: ${quantity}L`,
      };
    }

    const order = item.orderId as any;
    const tankerBeforeStock = tanker.stockLevel;
    const tankerAfterStock = tankerBeforeStock - quantity;
    const meterBefore = dispenser.totalDispensed || 0;
    const meterAfter = meterBefore + quantity;

    // Update order item
    await OrderItem.findByIdAndUpdate(
      itemId,
      {
        status: "completed",
        dispenserId: dispenser._id,
        attendanceId: attendance._id,
        ...(signature && { signature }),
      },
      { session, runValidators: false },
    );

    // Update order status if all items completed
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

    // Update tanker stock (decrease)
    await Tanker.findByIdAndUpdate(
      tanker._id,
      {
        stockLevel: tankerAfterStock,
        lastReading: tankerAfterStock,
        lastReadingDate: new Date(),
      },
      { session },
    );

    // Update dispenser meter reading (increase total dispensed)
    await Dispenser.findByIdAndUpdate(
      dispenser._id,
      {
        totalDispensed: meterAfter,
        lastReading: meterAfter,
        lastReadingDate: new Date(),
      },
      { session },
    );

    // Record tanker transaction (stock out)
    await TankerTransaction.create(
      [
        {
          tankerId: tanker._id,
          type: "TRANSFER_OUT",
          quantity: quantity,
          beforeStock: tankerBeforeStock,
          afterStock: tankerAfterStock,
          details: {
            dispenserId: dispenser._id,
            dispenserName: dispenser.name,
            orderId: order._id,
            orderItemId: item._id,
            customerName: order.companyName,
            plateNumber: order.truckId?.plateNumber || order.truckNumber,
          },
          timestamp: new Date(),
        },
      ],
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
          balanceBefore: meterBefore,
          balanceAfter: meterAfter,
          type: "SALE",
          metadata: {
            companyName: order.companyName,
            plateNumber: order.truckId?.plateNumber || order.truckNumber,
            driverName: order.driverName,
            tankerId: tanker._id.toString(),
            tankerName: tanker.name,
            attendantName,
          },
        },
      ],
      { session },
    );

    // Update attendance record total dispensed
    await DispenserAttendanceRecord.findByIdAndUpdate(
      attendance._id,
      { $inc: { totalDispensed: quantity } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    // Return with attendant name from populated data
    return {
      success: true,
      message: "Order completed successfully",
      data: {
        dispenserName: dispenser.name,
        tankerName: tanker.name,
        litresSold: quantity,
        tankerRemainingStock: tankerAfterStock,
        meterReading: meterAfter,
        attendantName,
        attendantId: attendance.attendantId?._id?.toString(),
        loginTime: attendance.loginTime,
        openingBalance: attendance.openingBalanceLitres,
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

export async function getOrderQuantitiesByProductService(productId: string) {
  await connectDB();

  const result = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // Filter by productId
    {
      $match: {
        "order.productId": new mongoose.Types.ObjectId(productId),
      },
    },

    // Group by order status
    {
      $group: {
        _id: "$order.status",
        totalQuantity: { $sum: "$quantity" },
        count: { $sum: 1 },
      },
    },
  ]);

  const quantities = {
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
  };

  result.forEach((item: any) => {
    if (item._id === "pending") {
      quantities.pending = item.totalQuantity;
    }
    if (item._id === "accepted") {
      quantities.accepted = item.totalQuantity;
    }
    if (item._id === "completed") {
      quantities.completed = item.totalQuantity;
    }
    if (item._id === "cancelled") {
      quantities.cancelled = item.totalQuantity;
    }
  });

  return quantities;
}

export async function getOrdersByProductService(productId: string) {
  await connectDB();

  const orderItems = await OrderItem.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },

    // Filter by productId
    {
      $match: {
        "order.productId": new mongoose.Types.ObjectId(productId),
      },
    },

    // Sort by newest first
    { $sort: { "order.createdAt": -1 } },

    // Project the fields we need
    {
      $project: {
        _id: "$_id",
        status: "$order.status",
        quantity: 1,
        createdAt: "$order.createdAt",
      },
    },
  ]);

  return orderItems.map((oi) => ({
    id: oi._id.toString(),
    status: oi.status,
    quantity: oi.quantity,
    createdAt: oi.createdAt,
  }));
}

export async function getOrderItemByIdService(orderItemId: string) {
  await connectDB();

  return await OrderItem.findById(orderItemId)
    .populate({
      path: "orderId",
      populate: [
        { path: "productId", select: "name" },
        { path: "companyId", select: "name" },
      ],
    })
    .populate("truckId", "plateNumber make model year")
    .populate("dispenserId", "name")
    .populate({
      path: "attendanceId",
      populate: {
        path: "attendantId",
        select: "name",
      },
    })
    .lean();
}
