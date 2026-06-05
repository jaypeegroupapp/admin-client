"use client";

import { motion } from "framer-motion";
import { Calendar, User, Droplet, ChevronDown, ChevronUp } from "lucide-react";
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";
import { StatusBadge } from "./status-badge";
import { VarianceBadge } from "./variance-badge";
import { ExpandedShiftDetails } from "./expanded-shift-details";

interface AttendanceHistoryItemProps {
  record: IDispenserAttendanceRecord;
  isExpanded: boolean;
  onToggle: () => void;
}

export function AttendanceHistoryItem({
  record,
  isExpanded,
  onToggle,
}: AttendanceHistoryItemProps) {
  // CORRECT FORMULA: Expected closing = opening + dispensed
  const expectedClosing =
    (record.openingBalanceLitres || 0) + (record.totalDispensed || 0);
  const variance = record.variance || 0;
  const variancePercent =
    expectedClosing > 0
      ? (variance / expectedClosing) * 100
      : (record.totalDispensed || 0) > 0
        ? (variance / (record.totalDispensed || 0)) * 100
        : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div
        className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date(record.loginTime).toLocaleDateString("en-ZA")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="text-sm font-medium">
                {record.attendantName || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplet size={14} className="text-gray-400" />
              <span className="text-sm">
                <span className="text-gray-500">Dispensed:</span>{" "}
                <span className="font-medium text-green-600">
                  +{(record.totalDispensed || 0).toLocaleString()}L
                </span>
              </span>
            </div>
            {variance !== 0 && (
              <VarianceBadge variancePercent={variancePercent} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={record.status} />
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-gray-50"
        >
          <ExpandedShiftDetails record={record} />
        </motion.div>
      )}
    </motion.div>
  );
}
