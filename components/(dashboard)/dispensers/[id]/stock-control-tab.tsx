// src/components/(dashboard)/dispensers/[id]/stock-control-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getDispenserStockHistory,
  getDispenserStockAnalytics,
  getCurrentBalance,
} from "@/data/dispenser-stock-record";
import { FillDispenserModal } from "./fill-dispenser-modal";

export function StockControlTab({
  dispenserId,
  dispenserLitres,
}: {
  dispenserId: string;
  dispenserLitres: number;
}) {
  const [stockRecords, setStockRecords] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const loadData = async () => {
    const [records, analyticsData] = await Promise.all([
      getDispenserStockHistory(dispenserId),
      getDispenserStockAnalytics(dispenserId),
    ]);

    setStockRecords(records);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    loadData();
  }, [dispenserId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Completed
          </span>
        );
      case "discrepancy":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            Discrepancy
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            Pending
          </span>
        );
    }
  };

  return (
    <>
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium">Current Balance</p>
            <p className="text-2xl font-bold text-blue-700">
              {dispenserLitres.toFixed(1)}L
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium">Total Fills</p>
            <p className="text-2xl font-bold text-green-700">
              {analytics.totalFills}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs text-purple-600 font-medium">
              Total Purchased
            </p>
            <p className="text-2xl font-bold text-purple-700">
              {analytics.totalPurchased.toFixed(1)}L
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-xs text-orange-600 font-medium">Avg Variance</p>
            <p className="text-2xl font-bold text-orange-700">
              {analytics.avgVariancePercentage.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Header with Action Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          Stock Fill History
        </h3>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Record Fill
        </button>
      </div>

      {/* Stock Records */}
      {stockRecords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Package size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No stock fill records yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Record your first fill
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {stockRecords.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Record Header - Always visible */}
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
                      {new Date(record.fillDate).toLocaleDateString("en-ZA")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      <span className="text-gray-500">Opening:</span>{" "}
                      <span className="font-medium">
                        {record.openingBalance}L
                      </span>
                    </span>

                    <span className="text-sm">
                      <span className="text-gray-500">Added:</span>{" "}
                      <span className="font-medium text-green-600">
                        +{record.purchasedQuantity}L
                      </span>
                    </span>

                    <span className="text-sm">
                      <span className="text-gray-500">Actual:</span>{" "}
                      <span className="font-medium">
                        {record.actualMeterReading}L
                      </span>
                    </span>
                  </div>

                  {getStatusBadge(record.status)}
                </div>

                {expandedRecord === record.id ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>
              {/* // In the StockControlTab component, update the expanded view to
              show purchase details: */}
              {/* Expanded Details */}
              {expandedRecord === record.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 bg-gray-50 p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Volume Calculations */}
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                        Volume Calculation
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Opening Balance:
                          </span>
                          <span className="font-medium">
                            {record.openingBalance}L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purchased:</span>
                          <span className="font-medium text-green-600">
                            +{record.purchasedQuantity}L
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                          <span className="text-gray-600">
                            Expected Closing:
                          </span>
                          <span className="font-medium">
                            {record.expectedClosingBalance}L
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual Reading:</span>
                          <span className="font-medium">
                            {record.actualMeterReading}L
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                          <span className="text-gray-600">Variance:</span>
                          <span
                            className={`font-medium ${
                              Math.abs(record.variance) < 0.1
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {record.variance > 0 ? "+" : ""}
                            {record.variance.toFixed(2)}L
                            <span className="text-xs ml-1">
                              ({record.variancePercentage.toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Details (if available) */}
                    {record.invoiceNumber && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">
                          Purchase Details
                        </h4>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-800">
                              {record.supplierName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice: {record.invoiceNumber}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                              <div>
                                <span className="text-gray-500">
                                  Unit Price:
                                </span>
                                <p className="font-medium">
                                  R{record.invoiceUnitPrice?.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Total Cost:
                                </span>
                                <p className="font-medium">
                                  R
                                  {(
                                    record.purchasedQuantity *
                                    (record.invoiceUnitPrice || 0)
                                  ).toFixed(2)}
                                </p>
                              </div>
                              {record.gridAtPurchase > 0 && (
                                <>
                                  <div>
                                    <span className="text-gray-500">
                                      Selling Price:
                                    </span>
                                    <p className="font-medium">
                                      R{record.gridAtPurchase.toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">
                                      Potential Revenue:
                                    </span>
                                    <p className="font-medium">
                                      R
                                      {(
                                        record.purchasedQuantity *
                                        record.gridAtPurchase
                                      ).toFixed(2)}
                                    </p>
                                  </div>
                                </>
                              )}
                              {record.discount > 0 && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">
                                    Discount:
                                  </span>
                                  <p className="font-medium">
                                    {record.discount}%
                                  </p>
                                </div>
                              )}
                            </div>

                            {record.invoiceDate && (
                              <p className="text-xs text-gray-400 mt-2">
                                Invoice Date:{" "}
                                {new Date(
                                  record.invoiceDate,
                                ).toLocaleDateString("en-ZA")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes and Metadata */}
                    <div className="md:col-span-2 mt-2">
                      {record.notes && (
                        <p className="text-sm text-gray-600 bg-white p-2 rounded">
                          <span className="font-medium">Notes:</span>{" "}
                          {record.notes}
                        </p>
                      )}

                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>
                          Recorded:{" "}
                          {new Date(record.createdAt).toLocaleString("en-ZA")}
                        </span>
                        {record.fillDate && (
                          <span>
                            Fill Date:{" "}
                            {new Date(record.fillDate).toLocaleDateString(
                              "en-ZA",
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Discrepancy Warning */}
                  {record.status === "discrepancy" && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                      <AlertTriangle
                        size={16}
                        className="text-red-500 mt-0.5"
                      />
                      <p className="text-xs text-red-700">
                        Variance of {record.variance.toFixed(2)}L (
                        {record.variancePercentage.toFixed(1)}%) detected.
                        Please investigate possible leak, theft, or meter
                        calibration issue.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Fill Dispenser Modal */}
      <FillDispenserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        dispenserId={dispenserId}
        currentBalance={dispenserLitres}
        onSuccess={loadData}
      />
    </>
  );
}
