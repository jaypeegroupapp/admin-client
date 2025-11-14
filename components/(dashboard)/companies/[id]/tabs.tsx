"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Package, ChevronRight } from "lucide-react";
import { getTrucks, getTrucksByCompanyId } from "@/data/truck";
import { getOrdersByCompanyId } from "@/data/order";
import Link from "next/link";

interface Props {
  activeTab: "trucks" | "orders";
  onTabChange: (tab: "trucks" | "orders") => void;
  companyId: string;
}

export function CompanyTabs({ activeTab, onTabChange, companyId }: Props) {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trucks, orders] = await Promise.all([
          getTrucksByCompanyId(companyId),
          getOrdersByCompanyId(companyId),
        ]);
        setTrucks(trucks || []);
        setOrders(orders || []);
      } catch (e) {
        console.error("Failed to fetch company related data", e);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* 🧭 Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => onTabChange("trucks")}
          className={`pb-2 font-medium text-sm ${
            activeTab === "trucks"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Trucks
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

      {/* 🧩 Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "trucks" ? (
          <motion.div
            key="trucks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {trucks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No trucks linked to this company.
              </p>
            ) : (
              <div className="divide-y divide-gray-200">
                {trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Truck size={18} />
                      </div>
                      <span className="text-gray-800 text-sm font-medium">
                        {truck.make +
                          " " +
                          truck.model +
                          " (" +
                          truck.year +
                          ")" || "Unnamed Truck"}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      {truck.plateNumber}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                No orders for this company yet.
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
