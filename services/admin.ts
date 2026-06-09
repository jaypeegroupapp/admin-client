import { connectDB } from "@/lib/db";
import Tanker from "@/models/tanker";
import Dispenser from "@/models/dispenser";
import Order from "@/models/order";
import OrderItem from "@/models/order-item";
import CashTransaction from "@/models/cash-transactions";
import DispenserUsage from "@/models/dispenser-usage";
import { Types } from "mongoose";

export async function getAdminDashboardDataService() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Stock Data
  const tankers = await Tanker.find({ isPublished: true }).lean();
  const totalStock = tankers.reduce((sum, t) => sum + (t.stockLevel || 0), 0);
  const totalCapacity = tankers.reduce((sum, t) => sum + (t.capacity || 0), 0);
  const lowStockTankers = tankers.filter(
    (t) => (t.stockLevel / t.capacity) * 100 < 20,
  ).length;

  // Today's Sales
  const todayOrders = await OrderItem.aggregate([
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
      $match: {
        "order.createdAt": { $gte: today, $lt: tomorrow },
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: "$quantity" },
        totalCount: { $sum: 1 },
      },
    },
  ]);

  const todayCash = await CashTransaction.aggregate([
    {
      $match: {
        createdAt: { $gte: today, $lt: tomorrow },
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalLitres: { $sum: "$litresPurchased" },
        totalRevenue: { $sum: "$total" },
        totalCount: { $sum: 1 },
      },
    },
  ]);

  const todaySalesLitres =
    (todayOrders[0]?.totalLitres || 0) + (todayCash[0]?.totalLitres || 0);
  const todayRevenue = todayCash[0]?.totalRevenue || 0;

  // Order Status Counts
  const orderStatusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalLitres: { $sum: "$totalAmount" },
      },
    },
  ]);

  const pendingOrders =
    orderStatusCounts.find((o) => o._id === "pending")?.count || 0;
  const acceptedOrders =
    orderStatusCounts.find((o) => o._id === "accepted")?.count || 0;
  const completedOrders =
    orderStatusCounts.find((o) => o._id === "completed")?.count || 0;

  // Recent Transactions
  const recentTransactions = await DispenserUsage.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .populate("dispenserId", "name")
    .populate("attendanceId", "attendantId")
    .lean();

  // Pending Orders List
  const pendingOrdersList = await Order.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("companyId", "name")
    .populate("productId", "name")
    .lean();

  // Stock by Product
  const stockByProduct = await Tanker.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: "$productId",
        totalStock: { $sum: "$stockLevel" },
        totalCapacity: { $sum: "$capacity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
  ]);

  return {
    stock: {
      totalStock,
      totalCapacity,
      lowStockCount: lowStockTankers,
      utilizationPercentage:
        totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0,
      stockByProduct,
    },
    sales: {
      todayLitres: todaySalesLitres,
      todayRevenue,
      orderCount: todayOrders[0]?.totalCount || 0,
      cashCount: todayCash[0]?.totalCount || 0,
    },
    orders: {
      pending: pendingOrders,
      accepted: acceptedOrders,
      completed: completedOrders,
    },
    recentTransactions,
    pendingOrdersList,
  };
}
