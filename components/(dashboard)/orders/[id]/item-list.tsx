// src/components/(dashboard)/orders/[id]/item-list.tsx
"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { OrderItemCard } from "./item-card";
import { OrderItemsSummary } from "./items-summary";

export function OrderItemsList({
  sellingPrice,
  items,
}: {
  sellingPrice: number;
  items: any[];
}) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * sellingPrice,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
        <Package size={32} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No items added to this order.</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-gray-500" />
          Order Items
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Total items: {items.length}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            sellingPrice={sellingPrice}
          />
        ))}
      </div>

      <OrderItemsSummary
        totalQuantity={totalQuantity}
        totalAmount={totalAmount}
        itemCount={items.length}
      />
    </motion.div>
  );
}
