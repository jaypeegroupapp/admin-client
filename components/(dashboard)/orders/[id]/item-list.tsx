"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

interface OrderItem {
  id: string;
  truckName: string;
  quantity: number;
}

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No items added to this order.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Truck size={18} />
                </div>
                <span className="text-gray-800 text-sm font-medium">
                  {item.truckName}
                </span>
              </div>

              <span className="text-gray-600 text-sm">
                Qty: <span className="font-semibold">{item.quantity}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
