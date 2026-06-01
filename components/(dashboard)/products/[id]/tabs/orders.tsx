"use client";

import { ShoppingCart, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function OrdersTab({
  orders,
  pendingOrderQuantity,
  acceptedOrderQuantity,
  tankerTotalStock,
}: {
  orders: any[];
  pendingOrderQuantity: number;
  acceptedOrderQuantity: number;
  tankerTotalStock: number;
}) {
  const canFulfillAccepted = tankerTotalStock >= acceptedOrderQuantity;
  const stockAfterAccepted = tankerTotalStock - acceptedOrderQuantity;

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Order Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-xs text-yellow-600">Pending Orders</p>
          <p className="text-xl font-bold text-yellow-700">
            {pendingOrderQuantity.toLocaleString()}L
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-blue-600">Accepted Orders</p>
          <p className="text-xl font-bold text-blue-700">
            {acceptedOrderQuantity.toLocaleString()}L
          </p>
        </div>
      </div>

      {/* Accepted Orders Fulfillment Status */}
      {acceptedOrderQuantity > 0 && (
        <div
          className={`p-3 rounded-lg flex items-start gap-2 ${
            !canFulfillAccepted
              ? "bg-red-50 border border-red-200"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <AlertTriangle
            size={16}
            className={!canFulfillAccepted ? "text-red-500" : "text-green-500"}
          />
          <div>
            <p
              className={`text-sm font-medium ${!canFulfillAccepted ? "text-red-700" : "text-green-700"}`}
            >
              {!canFulfillAccepted
                ? "Insufficient Stock for Accepted Orders"
                : "Sufficient Stock for Accepted Orders"}
            </p>
            {!canFulfillAccepted ? (
              <p className="text-xs text-red-600 mt-1">
                Shortfall of{" "}
                {(acceptedOrderQuantity - tankerTotalStock).toLocaleString()}L.
                Please restock immediately.
              </p>
            ) : (
              <p className="text-xs text-green-600 mt-1">
                Stock available: {tankerTotalStock.toLocaleString()}L. After
                fulfillment: {stockAfterAccepted.toLocaleString()}L remaining.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No orders for this product yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {orders.map((order) => (
            <Link
              href={`/orders/${order.id}`}
              key={order.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <ShoppingCart size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 text-sm font-medium">
                    Order #{order.id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {order.quantity}L •{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-ZA")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "accepted"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
