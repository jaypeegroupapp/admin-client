"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Plus,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getTankerSpillageRecords,
  getTankerSpillageAnalytics,
} from "@/data/tanker-spillage";
import { RecordSpillageModal } from "./record-spillage-modal";

export function SpillageTab({ tankerId }: { tankerId: string }) {
  const [spillageRecords, setSpillageRecords] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const loadData = async () => {
    const [records, analyticsData] = await Promise.all([
      getTankerSpillageRecords(tankerId),
      getTankerSpillageAnalytics(tankerId),
    ]);
    setSpillageRecords(records);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    loadData();
  }, [tankerId]);

  const getSpillageTypeColor = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return "bg-orange-100 text-orange-700";
      case "STORAGE":
        return "bg-red-100 text-red-700";
      case "HANDLING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSpillageTypeLabel = (type: string) => {
    switch (type) {
      case "TRANSFER":
        return "Transfer Spillage";
      case "STORAGE":
        return "Storage Leakage";
      case "HANDLING":
        return "Handling Spillage";
      default:
        return type;
    }
  };

  return (
    <>
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-xs text-red-600 font-medium">Total Spillage</p>
            <p className="text-2xl font-bold text-red-700">
              {analytics.totalSpillage.toFixed(1)}L
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-xs text-orange-600 font-medium">
              Spillage Events
            </p>
            <p className="text-2xl font-bold text-orange-700">
              {analytics.totalEvents}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-xs text-yellow-600 font-medium">Est. Cost</p>
            <p className="text-2xl font-bold text-yellow-700">
              R{analytics.totalCost?.toFixed(2) || 0}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-purple-600 font-medium">Most Common</p>
            <p className="text-lg font-bold text-purple-700">
              {analytics.mostCommonType || "N/A"}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <AlertTriangle size={16} className="text-gray-500" />
          Spillage Records
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          <Plus size={16} />
          Record Spillage
        </button>
      </div>

      {spillageRecords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertTriangle size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No spillage records found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {spillageRecords.map((record) => (
            <motion.div
              key={record.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() =>
                  setExpandedRecord(
                    expandedRecord === record.id ? null : record.id,
                  )
                }
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(record.spillageDate).toLocaleDateString(
                        "en-ZA",
                      )}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getSpillageTypeColor(record.type)}`}
                  >
                    {getSpillageTypeLabel(record.type)}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    -{record.quantity}L
                  </span>
                </div>
                {expandedRecord === record.id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>

              {expandedRecord === record.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                        Details
                      </h4>
                      <p className="text-sm">
                        Quantity Lost: {record.quantity}L
                      </p>
                      {record.estimatedCost && (
                        <p className="text-sm">
                          Estimated Cost: R{record.estimatedCost}
                        </p>
                      )}
                      <p className="text-sm">Reason: {record.reason}</p>
                    </div>
                    {record.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span>{" "}
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <RecordSpillageModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          loadData();
        }}
        tankerId={tankerId}
        currentStock={0}
      />
    </>
  );
}
