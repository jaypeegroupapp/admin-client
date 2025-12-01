import { connectDB } from "@/lib/db";
import OrderItem from "@/models/order-item";
import mongoose, { Types } from "mongoose";

export async function getOrderItemsService(
  page = 0,
  pageSize = 10,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
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
      { "company.companyName": { $regex: termRegex } },
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

        companyName: "$company.companyName",
        productName: "$product.name",
      },
    },
  ]);

  return JSON.parse(JSON.stringify(agg));
}

export async function completeOrderItem(itemId: string, signature?: string) {
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
}
