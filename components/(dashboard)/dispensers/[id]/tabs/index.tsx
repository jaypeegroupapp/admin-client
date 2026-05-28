"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Users, Droplet, ArrowLeftRight, Settings } from "lucide-react";

// Tab components
import { InfoTab } from "./info-tab";
import { AttendanceTab } from "./attendance-tab";
import { UsageTab } from "./usage-tab";
import { TransfersTab } from "./transfers-tab";
import { SettingsTab } from "./settings-tab";

interface Props {
  dispenserId: string;
  totalDispensed: number;
  activeTab: "info" | "attendance" | "usage" | "transfers" | "settings";
  onTabChange: (
    tab: "info" | "attendance" | "usage" | "transfers" | "settings",
  ) => void;
}

export function DispenserTabs({
  dispenserId,
  totalDispensed,
  activeTab,
  onTabChange,
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
          onClick={() => onTabChange("attendance")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
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
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "usage"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Droplet size={16} />
          Usage History
        </button>

        <button
          onClick={() => onTabChange("transfers")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "transfers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ArrowLeftRight size={16} />
          Tanker Transfers
        </button>

        <button
          onClick={() => onTabChange("settings")}
          className={`pb-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === "settings"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings size={16} />
          Settings
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
            <InfoTab dispenserId={dispenserId} />
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
              totalDispensed={totalDispensed}
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

        {activeTab === "transfers" && (
          <motion.div
            key="transfers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TransfersTab
              dispenserId={dispenserId}
              totalDispensed={totalDispensed}
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
