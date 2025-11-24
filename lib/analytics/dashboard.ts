import Company from "@/models/company";
import User from "@/models/user";
import Truck from "@/models/truck";
import Product from "@/models/product";
import Order from "@/models/order";
import { connectDB } from "../db";

/* ------------------------ SUMMARY -------------------------------- */
export async function getDashboardSummary() {
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

/* ---------------------- MONTHLY ORDERS --------------------------- */
export async function getMonthlyOrdersStats() {
  await connectDB();

  return await Order.aggregate([
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
}

/* ---------------------- REVENUE STATS --------------------------- */
export async function getRevenueStats() {
  await connectDB();

  return await Order.aggregate([
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
}

/* ---------------------- ORDER STATUS STATS ----------------------- */
export async function getOrderStatusStats() {
  await connectDB();

  return await Order.aggregate([
    {
      $group: { _id: "$status", value: { $sum: 1 } },
    },
    { $project: { status: "$_id", value: 1, _id: 0 } },
  ]);
}

/* ---------------------- ORDERS BY MINE --------------------------- */
export async function getOrdersByMineStats() {
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
    { $project: { mine: "$_id", orders: 1, _id: 0 } },
  ]);
}

/* ---------------------- TOP COMPANIES --------------------------- */
export async function getTopCompaniesStats() {
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
    { $project: { company: "$_id", orders: 1, _id: 0 } },
  ]);
}
