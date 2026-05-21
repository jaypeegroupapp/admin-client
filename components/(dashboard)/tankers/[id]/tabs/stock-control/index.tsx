"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getTankerStockHistory,
  getTankerStockAnalytics,
} from "@/data/tanker-stock";
import { RestockTankerModal } from "./restock-modal";

export function StockControlTab({
  tankerId,
  currentStock,
  capacity,
}: {
  tankerId: string;
  currentStock: number;
  capacity: number;
}) {
  const [stockRecords, setStockRecords] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const loadData = async () => {
    const [records, analyticsData] = await Promise.all([
      getTankerStockHistory(tankerId),
      getTankerStockAnalytics(tankerId),
    ]);
    setStockRecords(records);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    loadData();
  }, [tankerId]);

  return (
    <>
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium">Current Stock</p>
            <p className="text-2xl font-bold text-blue-700">{currentStock}L</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium">Total Restocks</p>
            <p className="text-2xl font-bold text-green-700">
              {analytics.totalRestocks}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-purple-600 font-medium">
              Total Received
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {analytics.totalReceived.toFixed(1)}L
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-xs text-orange-600 font-medium">Fill Rate</p>
            <p className="text-2xl font-bold text-orange-700">
              {((currentStock / capacity) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          Restock History
        </h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Record Restock
        </button>
      </div>

      {stockRecords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Package size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No restock records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stockRecords.map((record) => (
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
                      {new Date(record.restockDate).toLocaleDateString("en-ZA")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      <span className="text-gray-500">Before:</span>{" "}
                      <span className="font-medium">{record.beforeStock}L</span>
                    </span>
                    <span className="text-sm">
                      <span className="text-gray-500">Added:</span>{" "}
                      <span className="font-medium text-green-600">
                        +{record.quantityAdded}L
                      </span>
                    </span>
                    <span className="text-sm">
                      <span className="text-gray-500">After:</span>{" "}
                      <span className="font-medium">{record.afterStock}L</span>
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      record.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status === "completed" ? "Completed" : "Pending"}
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
                  <div className="grid grid-cols-2 gap-4">
                    {record.supplierName && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">
                          Supplier Details
                        </h4>
                        <p className="text-sm">
                          Supplier: {record.supplierName}
                        </p>
                        {record.invoiceNumber && (
                          <p className="text-sm">
                            Invoice: {record.invoiceNumber}
                          </p>
                        )}
                      </div>
                    )}
                    {record.notes && (
                      <div className="col-span-2">
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

      <RestockTankerModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          loadData();
        }}
        tankerId={tankerId}
        currentStock={currentStock}
        capacity={capacity}
      />
    </>
  );
}
