// src/components/(dashboard)/orders/[id]/summary.tsx
"use client";

import { Calendar, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { OrderStatusBadge } from "./status-badge";
import { OrderInfoCard } from "./info-card";

export function OrderSummary({ order }: { order: any }) {
  const totalQuantity = order.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Order #{order.orderNumber}
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Calendar size={14} />
            Created on {new Date(order.createdAt).toLocaleDateString("en-ZA")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <OrderInfoCard
          icon={Package}
          label="Product"
          value={order.productName || "Diesel"}
        />
        <OrderInfoCard
          icon={Truck}
          label="Truck"
          value={order.items?.[0]?.plateNumber || "N/A"}
        />
        <OrderInfoCard
          icon={Package}
          label="Total Quantity"
          value={`${totalQuantity}L`}
          valueClassName="text-blue-600"
        />
        <OrderInfoCard
          icon={Package}
          label="Total Amount"
          value={`R ${order.totalAmount?.toFixed(2) || 0}`}
          valueClassName="text-green-600"
        />
      </div>

      {order.status === "accepted" && (
        <div className="p-3 rounded-lg bg-yellow-50">
          <p className="text-sm font-medium text-yellow-800">
            ⚠️ Order accepted but not yet completed
          </p>
        </div>
      )}
    </div>
  );
}