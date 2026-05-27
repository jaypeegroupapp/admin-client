"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fuel, Info, Package, AlertTriangle, History } from "lucide-react";
import { DispensersTab } from "./dispensers";
import { StockControlTab } from "./stock-control";
import { SpillageTab } from "./spillage";
import { HistoryTab } from "./history";

interface ConnectedDispenser {
  id: string;
  name: string;
  currentStock: number;
  isPublished: boolean;
}

interface Props {
  tankerId: string;
  tankerStock: number;
  tankerCapacity: number;
  activeTab: "info" | "dispensers" | "stock" | "spillage" | "history";
  onTabChange: (
    tab: "info" | "dispensers" | "stock" | "spillage" | "history",
  ) => void;
  connectedDispensers: ConnectedDispenser[];
  onRefresh: () => void;
}

export function TankerTabs({
  tankerId,
  tankerStock,
  tankerCapacity,
  activeTab,
  onTabChange,
  connectedDispensers,
  onRefresh,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => onTabChange("info")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Info size={16} />
          Info
        </button>

        <button
          onClick={() => onTabChange("dispensers")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "dispensers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Fuel size={16} />
          Dispensers ({connectedDispensers.length})
        </button>

        <button
          onClick={() => onTabChange("stock")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "stock"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Package size={16} />
          Stock Control
        </button>

        <button
          onClick={() => onTabChange("spillage")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "spillage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <AlertTriangle size={16} />
          Spillage
        </button>

        <button
          onClick={() => onTabChange("history")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <History size={16} />
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InfoTab tankerId={tankerId} />
          </motion.div>
        )}

        {activeTab === "dispensers" && (
          <motion.div
            key="dispensers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DispensersTab
              tankerId={tankerId}
              connectedDispensers={connectedDispensers}
              tankerStock={tankerStock}
              onRefresh={onRefresh} // Placeholder, implement refresh logic as needed
            />
          </motion.div>
        )}

        {activeTab === "stock" && (
          <motion.div
            key="stock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StockControlTab
              tankerId={tankerId}
              currentStock={tankerStock}
              capacity={tankerCapacity}
            />
          </motion.div>
        )}

        {activeTab === "spillage" && (
          <motion.div
            key="spillage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SpillageTab tankerId={tankerId} />
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HistoryTab tankerId={tankerId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoTab({ tankerId }: { tankerId: string }) {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        This tanker stores product inventory that supplies connected dispensers.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Tanker Details</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-gray-500">Tanker ID:</span>
            <span className="font-mono">{tankerId}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span>Product Storage Tanker</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span>Active/Inactive toggle available</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
