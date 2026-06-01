"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function OrdersTab({ orders }: { orders: any[] }) {
  // This can be implemented to show orders containing this product
  // For now, it redirects to the orders page with product filter

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders for this product yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <Link
              href={`/orders/${order.id}`}
              key={order.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <ShoppingCart size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 text-sm font-medium">
                    Order #{order.id?.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-ZA")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-600`}
                >
                  {order.status}
                </span>
                <ChevronRight />
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
