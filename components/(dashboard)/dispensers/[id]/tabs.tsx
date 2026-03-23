// src/components/(dashboard)/dispensers/[id]/tabs.tsx (updated)
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Settings, Info, Package, Users } from "lucide-react";
import { UsageTab } from "./usage-tab";
import { SettingsTab } from "./settings-tab";
import { StockControlTab } from "./stock-control-tab";
import { AttendanceTab } from "./attendance-tab";

interface Props {
  dispenserId: string;
  dispenserLitres: number;
  activeTab: "info" | "usage" | "settings" | "stock" | "attendance";
  onTabChange: (
    tab: "info" | "usage" | "settings" | "stock" | "attendance",
  ) => void;
}

export function DispenserTabs({
  dispenserId,
  dispenserLitres,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Tabs */}
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
          onClick={() => onTabChange("attendance")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "attendance"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={16} />
          Attendance
        </button>

        <button
          onClick={() => onTabChange("usage")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "usage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Droplet size={16} />
          Usage History
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

        {/* <button
          onClick={() => onTabChange("settings")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
            activeTab === "settings"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings size={16} />
          Settings
        </button> */}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Info content */}
            <div className="space-y-4">
              <p className="text-gray-700">
                This dispenser is configured to dispense products based on the
                assigned product ID.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Dispenser Details
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Dispenser ID:</span>
                    <span className="font-mono">{dispenserId}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Litres Capacity:</span>
                    <span>Variable (0 = unlimited)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span>Active/Inactive toggle available</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "attendance" && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AttendanceTab
              dispenserId={dispenserId}
              dispenserLitres={dispenserLitres}
            />
          </motion.div>
        )}

        {activeTab === "usage" && (
          <motion.div
            key="usage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UsageTab dispenserId={dispenserId} />
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
              dispenserId={dispenserId}
              dispenserLitres={dispenserLitres}
            />
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsTab dispenserId={dispenserId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
