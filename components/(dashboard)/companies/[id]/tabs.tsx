"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Package, Wallet, ChevronRight } from "lucide-react";
import { getTrucksByCompanyId } from "@/data/truck";
import { getOrdersByCompanyId } from "@/data/order";
import Link from "next/link";
import { CreditFacilityTab } from "./credit-facility-tab";

interface Props {
  activeTab: "trucks" | "orders" | "credit";
  onTabChange: (tab: "trucks" | "orders" | "credit") => void;
  companyId: string;
}

export function CompanyTabs({ activeTab, onTabChange, companyId }: Props) {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trucksData, ordersData] = await Promise.all([
          getTrucksByCompanyId(companyId),
          getOrdersByCompanyId(companyId),
        ]);
        setTrucks(trucksData || []);
        setOrders(ordersData || []);
      } catch (e) {
        console.error("Failed to fetch company related data", e);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {["trucks", "orders", "credit"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab as any)}
            className={`pb-2 font-medium text-sm ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "trucks" && "Trucks"}
            {tab === "orders" && "Orders"}
            {tab === "credit" && "Credit Facility"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        {activeTab === "trucks" && (
          <motion.div
            key="trucks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                          ")"}
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
        )}

        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders yet.</p>
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
                      <div>
                        <span className="text-gray-800 text-sm font-medium">
                          Order #{order.id?.slice(-6).toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-ZA"
                          )}
                        </p>
                      </div>
                    </div>
                    <ChevronRight />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "credit" && (
          <motion.div
            key="credit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CreditFacilityTab companyId={companyId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
