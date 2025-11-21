"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Truck } from "lucide-react";
import { getOrdersByMine } from "@/data/order";
import Link from "next/link";

interface Props {
  activeTab: "info" | "orders";
  onTabChange: (tab: "info" | "orders") => void;
  mineId: string;
}

export function MineTabs({ activeTab, onTabChange, mineId }: Props) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "orders") {
      getOrdersByMine(mineId).then((res) => setOrders(res || []));
    }
  }, [activeTab, mineId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* 🧭 Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => onTabChange("info")}
          className={`pb-2 font-medium text-sm ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Info
        </button>

        <button
          onClick={() => onTabChange("orders")}
          className={`pb-2 font-medium text-sm ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Orders
        </button>
      </div>

      {/* 🧩 Content */}
      <AnimatePresence mode="wait">
        {activeTab === "info" ? (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-600"
          >
            <p>No additional mine info available.</p>
          </motion.div>
        ) : (
          <motion.div
            key="orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">
                No orders linked to this mine yet.
              </p>
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
                        <Package size={18} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-gray-800 text-sm font-medium">
                          Order #{order.id?.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-ZA"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono">
                        {order.status}
                      </span>
                      <ChevronRight />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
