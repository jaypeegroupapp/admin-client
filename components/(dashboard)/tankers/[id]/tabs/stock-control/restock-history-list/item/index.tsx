"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { RestockItemHeader } from "./header";
import { RestockExpandedDetails } from "./expanded-details";

interface RestockHistoryItemProps {
  record: any;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RestockHistoryItem({
  record,
  isExpanded,
  onToggle,
}: RestockHistoryItemProps) {
  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 0.1) return "text-green-600";
    if (Math.abs(variance) < 1) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div
        className="p-4 bg-white hover:bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date(record.restockDate).toLocaleDateString("en-ZA")}
              </span>
            </div>

            <RestockItemHeader record={record} />

            {record.variance && record.variance !== 0 && (
              <span
                className={`text-sm font-medium ${getVarianceColor(record.variance)}`}
              >
                <span className="text-gray-500">Var:</span>{" "}
                {record.variance > 0 ? "+" : ""}
                {record.variance.toFixed(1)}L
              </span>
            )}
          </div>

          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-gray-50"
        >
          <RestockExpandedDetails record={record} />
        </motion.div>
      )}
    </motion.div>
  );
}
