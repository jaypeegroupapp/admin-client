"use client";

import { motion } from "framer-motion";
import { KPICards } from "./kpi-cards";
import { SalesTrendChart } from "./charts/sales-trend";
import { StockLevelsChart } from "./charts/stock-levels";
import { OrderDistributionChart } from "./charts/order-distribution";
import { PendingOrdersTable } from "./tables/pending-orders";
import { RecentTransactions } from "./tables/recent-transactions";
import { AlertsList } from "./tables/alerts-list";
import { QuickActions } from "./quick-actions";

interface AdminDashboardClientProps {
  initialData: any;
}

export function AdminDashboardClient({
  initialData,
}: AdminDashboardClientProps) {
  const data = initialData?.data;

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <QuickActions />
      </div>

      <KPICards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendChart />
        <StockLevelsChart stockByProduct={data.stock.stockByProduct} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PendingOrdersTable orders={data.pendingOrdersList} />
        </div>
        <div>
          <OrderDistributionChart orders={data.orders} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={data.recentTransactions} />
        <AlertsList stock={data.stock} orders={data.orders} />
      </div>
    </motion.div>
  );
}
