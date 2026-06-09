"use client";

import { StockCard } from "./stock";
import { SalesCard } from "./sales";
import { OrdersCard } from "./orders";
import { AlertsCard } from "./alerts";

interface KPICardsProps {
  data: any;
}

export function KPICards({ data }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StockCard
        totalStock={data.stock.totalStock}
        totalCapacity={data.stock.totalCapacity}
        utilizationPercentage={data.stock.utilizationPercentage}
      />
      <SalesCard
        todayLitres={data.sales.todayLitres}
        todayRevenue={data.sales.todayRevenue}
        orderCount={data.sales.orderCount}
        cashCount={data.sales.cashCount}
      />
      <OrdersCard
        pending={data.orders.pending}
        accepted={data.orders.accepted}
        completed={data.orders.completed}
      />
      <AlertsCard lowStockCount={data.stock.lowStockCount} />
    </div>
  );
}