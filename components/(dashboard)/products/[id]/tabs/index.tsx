"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Fuel, ShoppingCart } from "lucide-react";
import { TankersTab } from "./tankers";
import { OrdersTab } from "./orders";

interface Props {
  productId: string;
  activeTab: "info" | "tankers" | "orders";
  onTabChange: (tab: "info" | "tankers" | "orders") => void;
  totalOrderQuantity: number;
  tankerTotalStock: number;
  pendingOrderQuantity: number;
  acceptedOrderQuantity: number;
  orders: any[];
}

export function ProductTabs({
  productId,
  activeTab,
  onTabChange,
  totalOrderQuantity,
  tankerTotalStock,
  pendingOrderQuantity,
  acceptedOrderQuantity,
  orders,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Tabs Navigation */}
      <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => onTabChange("info")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Info size={16} />
          Info
        </button>

        <button
          onClick={() => onTabChange("tankers")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "tankers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Fuel size={16} />
          Tankers
        </button>

        <button
          onClick={() => onTabChange("orders")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ShoppingCart size={16} />
          Orders
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Product information and stock management.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Product Details
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Product ID:</span>
                    <span className="font-mono">{productId}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span>Fuel / Petroleum Product</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Tracked in:</span>
                    <span>Tankers & Dispensers</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tankers" && (
          <motion.div
            key="tankers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TankersTab productId={productId} />
          </motion.div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OrdersTab
              orders={orders}
              pendingOrderQuantity={pendingOrderQuantity}
              acceptedOrderQuantity={acceptedOrderQuantity}
              tankerTotalStock={tankerTotalStock}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
