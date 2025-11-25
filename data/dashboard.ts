"use server";

import {
  // NEW: Missing imports from your request
  getDashboardSummaryService,
  getMonthlyOrdersStatsService,
  getRevenueStatsService,
  getOrderStatusStatsService,
  getOrdersByMineStatsService,
  getTopCompaniesStatsService,

  // Existing imports
  getTruckStatusService,
  getProductStockService,
  getStockMovementService,
  getMonthlyCompanyInvoiceService,
  getSupplierSpendingService,
  getProductProfitMarginService,
  getMinePerformanceService,
} from "@/services/dashboard";

//
// 🔹 0. SUMMARY TILE STATS
//
export async function getDashboardSummary() {
  try {
    const result = await getDashboardSummaryService();
    return result;
  } catch (err: any) {
    console.error("❌ getDashboardSummary error:", err);
    return { totalOrders: 0, totalClients: 0, totalRevenue: 0, totalTrucks: 0 };
  }
}

//
// 🔹 1. MONTHLY ORDERS
//
export async function getMonthlyOrdersStats() {
  try {
    const result = await getMonthlyOrdersStatsService();
    return result.map((x: any) => ({
      month: x.month,
      orders: x.orders,
    }));
  } catch (err: any) {
    console.error("❌ getMonthlyOrdersStats error:", err);
    return [];
  }
}

//
// 🔹 2. MONTHLY REVENUE
//
export async function getRevenueStats() {
  try {
    const result = await getRevenueStatsService();
    return result.map((x: any) => ({
      month: x.month,
      revenue: x.revenue,
    }));
  } catch (err: any) {
    console.error("❌ getRevenueStats error:", err);
    return [];
  }
}

//
// 🔹 3. ORDER STATUS DISTRIBUTION
//
export async function getOrderStatusStats() {
  try {
    const result = await getOrderStatusStatsService();
    return result.map((x: any) => ({
      status: x.status,
      value: x.value,
    }));
  } catch (err: any) {
    console.error("❌ getOrderStatusStats error:", err);
    return [];
  }
}

//
// 🔹 4. ORDERS BY MINE
//
export async function getOrdersByMineStats() {
  try {
    const result = await getOrdersByMineStatsService();
    return result.map((x: any) => ({
      mine: x.mine,
      orders: x.orders,
    }));
  } catch (err: any) {
    console.error("❌ getOrdersByMineStats error:", err);
    return [];
  }
}

//
// 🔹 5. TOP COMPANIES BY ORDERS
//
export async function getTopCompaniesStats() {
  try {
    const result = await getTopCompaniesStatsService();
    return result.map((x: any) => ({
      company: x.company,
      orders: x.orders,
    }));
  } catch (err: any) {
    console.error("❌ getTopCompaniesStats error:", err);
    return [];
  }
}

//
// 6. TRUCK STATUS
//
export async function getTruckStatusStats() {
  try {
    const result = await getTruckStatusService();
    const mapped = result.map((x: any) => ({
      status: x._id === true ? "Active" : "Inactive",
      count: x.count,
    }));
    return mapped;
  } catch (error: any) {
    console.error("❌ getTruckStatusStats error:", error);
    return [];
  }
}

//
// 7. PRODUCT STOCK
//
export async function getProductStockStats() {
  try {
    const result = await getProductStockService();
    return result.map((p: any) => ({
      product: p.name,
      stock: p.stock,
      lowStock: p.stock < 10,
    }));
  } catch (error: any) {
    console.error("❌ getProductStockStats error:", error);
    return [];
  }
}

//
// 8. STOCK MOVEMENT STATS
//
export async function getStockMovementStats() {
  try {
    const result = await getStockMovementService();
    return result.map((x: any) => ({
      month: x.month,
      inbound: x.inbound ?? 0,
      outbound: x.outbound ?? 0,
    }));
  } catch (error: any) {
    console.error("❌ getStockMovementStats error:", error);
    return [];
  }
}

//
// 9. COMPANY INVOICE STATS
//
export async function getMonthlyCompanyInvoiceStats() {
  try {
    const result = await getMonthlyCompanyInvoiceService();
    return result.map((x: any) => ({
      month: x.month,
      total: x.totalAmount,
    }));
  } catch (error: any) {
    console.error("❌ getMonthlyCompanyInvoiceStats error:", error);
    return [];
  }
}

//
// 10. SUPPLIER SPENDING
//
export async function getSupplierSpendingStats() {
  try {
    const result = await getSupplierSpendingService();
    return result.map((x: any) => ({
      month: x.month,
      amount: x.amount,
    }));
  } catch (error: any) {
    console.error("❌ getSupplierSpendingStats error:", error);
    return [];
  }
}

//
// 11. PRODUCT PROFIT MARGIN
//
export async function getProductProfitMarginStats() {
  try {
    const result = await getProductProfitMarginService();
    return result.map((x: any) => ({
      product: x.name,
      margin: x.margin,
    }));
  } catch (error: any) {
    console.error("❌ getProductProfitMarginStats error:", error);
    return [];
  }
}

//
// 12. MINE PERFORMANCE
//
export async function getMinePerformanceStats() {
  try {
    const result = await getMinePerformanceService();
    return result.map((x: any) => ({
      mine: x.name,
      output: x.outputScore,
    }));
  } catch (error: any) {
    console.error("❌ getMinePerformanceStats error:", error);
    return [];
  }
}
