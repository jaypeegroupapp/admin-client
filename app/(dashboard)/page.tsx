import TilesSummary from "@/components/(dashboard)/dashboard/tiles-summary";
import BarChartCard from "@/components/(dashboard)/dashboard/bar-chart-card";
import LineChartCard from "@/components/(dashboard)/dashboard/line-chart-card";
import PieChartCard from "@/components/(dashboard)/dashboard/pie-chart-card";

import {
  getDashboardSummary,
  getMonthlyOrdersStats,
  getRevenueStats,
  getOrderStatusStats,
  getOrdersByMineStats,
  getTopCompaniesStats,

  // NEW ANALYTICS
  getTruckStatusStats,
  getProductStockStats,
  getStockMovementStats,
  getMonthlyCompanyInvoiceStats,
  getSupplierSpendingStats,
  getProductProfitMarginStats,
  getMinePerformanceStats,
} from "@/data/dashboard";
import { Home } from "lucide-react";

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();
  const monthlyOrders = await getMonthlyOrdersStats();
  const revenueStats = await getRevenueStats();
  const orderStatusStats = await getOrderStatusStats();
  const ordersByMine = await getOrdersByMineStats();
  const topCompanies = await getTopCompaniesStats();

  // NEW
  const truckStatus = await getTruckStatusStats();
  const productStocks = await getProductStockStats();
  const stockMovement = await getStockMovementStats();
  const monthlyCompanyInvoices = await getMonthlyCompanyInvoiceStats();
  const supplierSpending = await getSupplierSpendingStats();
  const productMargins = await getProductProfitMarginStats();
  const minePerformance = await getMinePerformanceStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-2">
        <Home className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Summary Tile Section */}
      <TilesSummary data={summary} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Existing */}
        <LineChartCard
          title="Monthly Orders"
          data={monthlyOrders}
          dataKey="orders"
        />
        <LineChartCard
          title="Monthly Revenue"
          data={revenueStats}
          dataKey="revenue"
        />

        <PieChartCard
          title="Order Status Distribution"
          data={orderStatusStats}
          dataKey="value"
          nameKey="status"
        />

        <BarChartCard
          title="Orders by Mine"
          data={ordersByMine}
          xKey="mine"
          barKey="orders"
        />

        <BarChartCard
          title="Top Transporters by Orders"
          data={topCompanies}
          xKey="company"
          barKey="orders"
        />

        {/* NEW CHARTS */}
        <PieChartCard
          title="Active vs Inactive Trucks"
          data={truckStatus}
          dataKey="count"
          nameKey="status"
        />

        <BarChartCard
          title="Product Stock Levels"
          data={productStocks}
          xKey="product"
          barKey="stock"
        />

        <BarChartCard
          title="Stock Movement (Inbound vs Outbound)"
          data={stockMovement}
          xKey="month"
          barKey="inbound"
          stackedKey="outbound"
        />

        <LineChartCard
          title="Monthly Transporter Invoices"
          data={monthlyCompanyInvoices}
          dataKey="total"
        />

        <LineChartCard
          title="Supplier Spending Trend"
          data={supplierSpending}
          dataKey="amount"
        />

        <BarChartCard
          title="Product Profit Margins"
          data={productMargins}
          xKey="product"
          barKey="margin"
        />

        <BarChartCard
          title="Mine Performance"
          data={minePerformance}
          xKey="mine"
          barKey="output"
        />
      </div>
    </div>
  );
}
