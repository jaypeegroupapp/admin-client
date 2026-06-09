"use client";

import { AlertTriangle, Package } from "lucide-react";

interface AlertsListProps {
  stock: any;
  orders: any;
}

export function AlertsList({ stock, orders }: AlertsListProps) {
  const alerts = [];

  if (stock.lowStockCount > 0) {
    alerts.push({
      type: "warning",
      message: `${stock.lowStockCount} tanker(s) have low stock (<20%)`,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    });
  }

  if (stock.utilizationPercentage > 90) {
    alerts.push({
      type: "info",
      message: "Tanker capacity is highly utilized. Consider restocking soon.",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    });
  }

  if (orders.pending > 10) {
    alerts.push({
      type: "warning",
      message: `${orders.pending} orders pending acceptance`,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Alerts</h3>
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-500">No active alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg ${alert.bg}`}
          >
            <alert.icon size={18} className={alert.color} />
            <p className="text-sm text-gray-700">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
