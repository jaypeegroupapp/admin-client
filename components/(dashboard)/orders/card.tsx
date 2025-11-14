"use client";

import { motion } from "framer-motion";
import { PackageCheck } from "lucide-react";
import { IOrder } from "@/definitions/order";
import { useRouter } from "next/navigation";

export function OrderCard({ order }: { order: IOrder }) {
  const router = useRouter();
  const date = new Date(order.collectionDate);
  const formatted = isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-ZA");

  const handleClick = () => {
    router.push(`/orders/${order.id}`);
  };

  // Generate a readable order number (e.g. ORD-2025-0001)
  const orderNumber =
    order.id?.slice(-6).toUpperCase() || Math.floor(Math.random() * 9999);

  return (
    <motion.div
      layout
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer hover:border-gray-400"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <PackageCheck />
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              Order #{orderNumber}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
              {order.status?.toUpperCase() || "PENDING"}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">Collection: {formatted}</p>
          <p className="text-sm text-gray-700 font-medium mt-2">
            R{order.totalAmount?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
