"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

interface PendingOrdersTableProps {
  orders: any[];
}

export function PendingOrdersTable({ orders }: PendingOrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Pending Orders
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          No pending orders
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Pending Orders</h3>
        <Link
          href="/orders"
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <Link
            key={order.id || order._id}
            href={`/orders/${order.id || order._id}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                {order.companyId?.name ||
                  order.companyName ||
                  "Unknown Company"}
              </p>
              <p className="text-xs text-gray-500">
                {order.productId?.name || order.productName || "Product"} • R
                {order.totalAmount?.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-yellow-500" />
              <span className="text-xs text-gray-500">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
