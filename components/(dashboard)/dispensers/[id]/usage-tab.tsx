// src/components/(dashboard)/dispensers/[id]/usage-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Droplet,
  Calendar,
  ShoppingCart,
  Banknote,
  Truck,
  User,
  TrendingDown,
  Package,
} from "lucide-react";
import { getDispenserUsageHistory } from "@/data/dispenser-usage";
import Link from "next/link";

export function UsageTab({ dispenserId }: { dispenserId: string }) {
  const [usage, setUsage] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "orders" | "cash">("all");
  const [loading, setLoading] = useState(true);

  const loadUsage = async () => {
    setLoading(true);
    const res = await getDispenserUsageHistory(dispenserId);
    setUsage(res || []);
    setLoading(false);
  };

  useEffect(() => {
    loadUsage();
  }, [dispenserId]);

  // Filter usage based on selection
  const filteredUsage = usage.filter((record) => {
    if (filter === "all") return true;
    if (filter === "orders") return record.type === "SALE" && record.orderId;
    if (filter === "cash")
      return record.type === "SALE" && record.cashTransactionId;
    return true;
  });

  // Calculate totals
  const totalLitres = filteredUsage.reduce(
    (sum, r) => sum + r.litresDispensed,
    0,
  );
  const orderCount = filteredUsage.filter((r) => r.orderId).length;
  const cashCount = filteredUsage.filter((r) => r.cashTransactionId).length;

  const getTransactionIcon = (record: any) => {
    if (record.cashTransactionId) {
      return <Banknote size={16} className="text-green-600" />;
    } else if (record.orderId) {
      return <ShoppingCart size={16} className="text-blue-600" />;
    }
    return <Droplet size={16} className="text-gray-600" />;
  };

  const getTransactionType = (record: any) => {
    if (record.cashTransactionId) {
      return {
        label: "Cash Sale",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        icon: Banknote,
        link: `/cash-transactions/${record.cashTransactionId}`,
      };
    } else if (record.orderId) {
      return {
        label: "Order Sale",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        icon: ShoppingCart,
        link: `/orders/${record.orderId}`,
      };
    }
    return {
      label: "Sale",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      icon: Droplet,
      link: null,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Droplet size={16} className="text-gray-500" />
          Usage History
        </h3>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              filter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({usage.length})
          </button>
          <button
            onClick={() => setFilter("orders")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
              filter === "orders"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <ShoppingCart size={14} />
            Orders ({orderCount})
          </button>
          <button
            onClick={() => setFilter("cash")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
              filter === "cash"
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            <Banknote size={14} />
            Cash ({cashCount})
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {filteredUsage.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Total Dispensed</p>
            <p className="text-lg font-semibold text-gray-800">
              {totalLitres}L
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600">Orders</p>
            <p className="text-lg font-semibold text-blue-700">{orderCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-600">Cash Sales</p>
            <p className="text-lg font-semibold text-green-700">{cashCount}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-purple-600">Avg per Sale</p>
            <p className="text-lg font-semibold text-purple-700">
              {(totalLitres / (filteredUsage.length || 1)).toFixed(1)}L
            </p>
          </div>
        </div>
      )}

      {/* Usage List */}
      {filteredUsage.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Droplet size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {filter === "all"
              ? "No usage records found for this dispenser."
              : filter === "orders"
                ? "No order transactions found."
                : "No cash transactions found."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsage.map((record) => {
            const type = getTransactionType(record);
            const TypeIcon = type.icon;
            const stockRemaining =
              (record.balanceAfter / record.balanceBefore) * 100;
            const stockUsed =
              ((record.balanceBefore - record.balanceAfter) /
                record.balanceBefore) *
              100;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between">
                    {/* Left side - Main info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-full ${type.bgColor}`}>
                          <TypeIcon size={14} className={type.textColor} />
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.bgColor} ${type.textColor}`}
                        >
                          {type.label}
                        </span>
                        {record.balanceBefore && record.balanceAfter && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingDown size={12} className="text-red-400" />
                            {record.balanceBefore}L → {record.balanceAfter}L
                          </span>
                        )}
                      </div>

                      <p className="text-base font-semibold text-gray-800 mb-1">
                        {record.litresDispensed}L dispensed
                      </p>

                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <Calendar size={12} />
                        {new Date(record.timestamp).toLocaleDateString(
                          "en-ZA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}{" "}
                        at{" "}
                        {new Date(record.timestamp).toLocaleTimeString("en-ZA")}
                      </p>

                      {/* Cash Transaction Details */}
                      {record.cashTransactionId && (
                        <div className="mt-2 space-y-1 bg-green-50 p-2 rounded">
                          {record.metadata?.companyName && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <Package size={12} className="text-gray-400" />
                              Company: {record.metadata.companyName}
                            </p>
                          )}
                          {record.metadata?.plateNumber && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <Truck size={12} className="text-gray-400" />
                              Truck: {record.metadata.plateNumber}
                            </p>
                          )}
                          {record.metadata?.driverName && (
                            <p className="text-xs text-gray-600 flex items-center gap-1">
                              <User size={12} className="text-gray-400" />
                              Driver: {record.metadata.driverName}
                            </p>
                          )}
                          {/* Attendant info */}
                          {record.attendantStaffName && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100">
                              <User size={12} className="text-gray-400" />
                              <span>
                                Attendant:{" "}
                                <span className="font-medium text-gray-700">
                                  {record.attendantStaffName}
                                </span>
                                {record.attendantStaffName && (
                                  <span className="text-gray-400 ml-1">
                                    ({record.attendantStaffName})
                                  </span>
                                )}
                              </span>
                              {record.attendanceLoginTime && (
                                <span className="text-gray-400 ml-2">
                                  •{" "}
                                  {new Date(
                                    record.attendanceLoginTime,
                                  ).toLocaleTimeString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Details */}
                      {record.orderId && (
                        <div className="mt-2">
                          <Link
                            href={type.link || "#"}
                            className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ShoppingCart size={12} />
                            View Order Details
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Right side - Amount badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${type.bgColor} ${type.textColor}`}
                      >
                        {record.litresDispensed}L
                      </span>

                      {/* Attendant info if available */}
                      {record.attendanceId && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <User size={10} />
                          Shift
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Balance timeline visualization */}
                  {record.balanceBefore && record.balanceAfter && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">Stock:</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${stockRemaining}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {record.balanceAfter}L remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
