"use server";

import Company from "@/models/company";
import User from "@/models/user";
import Truck from "@/models/truck";
import Product from "@/models/product";
import Order from "@/models/order";
import Mine from "@/models/mine";
import { connectDB } from "@/lib/db";
import { fillMissingMonths } from "@/lib/utils";

/* -----------------------------------------------------
   1. DASHBOARD SUMMARY
----------------------------------------------------- */
export async function getDashboardSummaryService() {
  await connectDB();

  const [
    totalCompanies,
    totalUsers,
    totalTrucks,
    totalProducts,
    ordersThisMonth,
    revenueThisMonth,
  ] = await Promise.all([
    Company.countDocuments(),
    User.countDocuments(),
    Truck.countDocuments({ isActive: true }),
    Product.countDocuments({ isPublished: true }),
    Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    }),
    getRevenueForCurrentMonth(),
  ]);

  return {
    totalCompanies,
    totalUsers,
    totalTrucks,
    totalProducts,
    ordersThisMonth,
    revenueThisMonth,
  };
}

async function getRevenueForCurrentMonth() {
  await connectDB();

  const res = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);

  return res[0]?.total || 0;
}

/* -----------------------------------------------------
   2. MONTHLY ORDERS STATS
----------------------------------------------------- */
export async function getMonthlyOrdersStatsService() {
  await connectDB();

  const results = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        orders: 1,
        _id: 0,
      },
    },
  ]);

  return fillMissingMonths(results, "orders");
}

/* -----------------------------------------------------
   3. MONTHLY REVENUE STATS
----------------------------------------------------- */

export async function getRevenueStatsService() {
  await connectDB();

  const results = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  return fillMissingMonths(results, "revenue");
}

/* -----------------------------------------------------
   4. ORDER STATUS DISTRIBUTION
----------------------------------------------------- */
export async function getOrderStatusStatsService() {
  await connectDB();

  return await Order.aggregate([
    {
      $group: { _id: "$status", value: { $sum: 1 } },
    },
    { $project: { status: "$_id", value: 1, _id: 0 } },
  ]);
}

/* -----------------------------------------------------
   5. ORDERS GROUPED BY MINE
----------------------------------------------------- */
export async function getOrdersByMineStatsService() {
  await connectDB();

  return await Order.aggregate([
    {
      $lookup: {
        from: "mines",
        localField: "mineId",
        foreignField: "_id",
        as: "mine",
      },
    },
    { $unwind: "$mine" },
    {
      $group: {
        _id: "$mine.name",
        orders: { $sum: 1 },
      },
    },
    {
      $project: {
        mine: "$_id",
        orders: 1,
        _id: 0,
      },
    },
  ]);
}

/* -----------------------------------------------------
   6. TOP COMPANIES BY ORDER VOLUME
----------------------------------------------------- */
export async function getTopCompaniesStatsService() {
  await connectDB();

  return await Order.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $group: {
        _id: "$company.companyName",
        orders: { $sum: 1 },
      },
    },
    { $sort: { orders: -1 } },
    { $limit: 5 },
    {
      $project: {
        company: "$_id",
        orders: 1,
        _id: 0,
      },
    },
  ]);
}

/* -----------------------------------------------------
   ORIGINAL CHART SERVICES (Truck, Stock, Profit, Mines)
----------------------------------------------------- */

export async function getTruckStatusService() {
  await connectDB();
  return await Truck.aggregate([
    { $group: { _id: "$isActive", count: { $sum: 1 } } },
  ]);
}

export async function getProductStockService() {
  await connectDB();
  return await Product.find({}, { name: 1, stock: 1 }).lean();
}

export async function getStockMovementService() {
  await connectDB();

  return await Product.aggregate([
    {
      $lookup: {
        from: "stockmovements",
        localField: "_id",
        foreignField: "productId",
        as: "movements",
      },
    },
    { $unwind: "$movements" },
    {
      $group: {
        _id: { $month: "$movements.date" },
        inbound: {
          $sum: {
            $cond: [
              { $eq: ["$movements.type", "inbound"] },
              "$movements.qty",
              0,
            ],
          },
        },
        outbound: {
          $sum: {
            $cond: [
              { $eq: ["$movements.type", "outbound"] },
              "$movements.qty",
              0,
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        inbound: 1,
        outbound: 1,
        _id: 0,
      },
    },
  ]);
}

export async function getMonthlyCompanyInvoiceService() {
  await connectDB();

  const results = await Order.aggregate([
    {
      $match: { status: { $ne: "cancelled" } },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        totalAmount: 1,
        _id: 0,
      },
    },
  ]);

  return fillMissingMonths(results, "totalAmount");
}

export async function getSupplierSpendingService() {
  await connectDB();

  const results = await Product.aggregate([
    {
      $lookup: {
        from: "stockmovements",
        localField: "_id",
        foreignField: "productId",
        as: "movements",
      },
    },
    { $unwind: "$movements" },
    {
      $group: {
        _id: { $month: "$movements.date" },
        amount: {
          $sum: {
            $multiply: ["$movements.purchasePrice", "$movements.qty"],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        month: "$_id",
        amount: 1,
        _id: 0,
      },
    },
  ]);

  return fillMissingMonths(results, "amount");
}

export async function getProductProfitMarginService() {
  await connectDB();

  return await Product.aggregate([
    {
      $project: {
        name: 1,
        margin: { $subtract: ["$sellingPrice", "$purchasePrice"] },
      },
    },
  ]);
}

export async function getMinePerformanceService() {
  await connectDB();

  return await Mine.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "mineId",
        as: "orders",
      },
    },
    {
      $project: {
        name: 1,
        outputScore: { $size: "$orders" },
      },
    },
  ]);
}
