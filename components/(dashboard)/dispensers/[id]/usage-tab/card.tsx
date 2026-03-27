// src/components/(dashboard)/dispensers/[id]/usage-card.tsx
"use client";

import { getStockRemainingPercentage, getTransactionType } from "@/lib/usage";
import {
  Calendar,
  ShoppingCart,
  Banknote,
  Truck,
  User,
  TrendingDown,
  Package,
  Droplet,
} from "lucide-react";
import Link from "next/link";

export function UsageCard({ record }: { record: any }) {
  const type = getTransactionType(record);
  const TypeIcon = type.icon;
  const stockRemaining = getStockRemainingPercentage(
    record.balanceBefore,
    record.balanceAfter,
  );

  return (
    <div className="p-4 bg-white">
      <div className="flex items-start justify-between">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                {record.balanceBefore.toFixed(2)}L →{" "}
                {record.balanceAfter.toFixed(2)}L
              </span>
            )}
          </div>

          <p className="text-base font-semibold text-gray-800 mb-1">
            {record.litresDispensed}L dispensed
          </p>

          <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
            <Calendar size={12} />
            {new Date(record.timestamp).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            at {new Date(record.timestamp).toLocaleTimeString("en-ZA")}
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
                <div className="text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100 pt-1 mt-1">
                  <User size={12} className="text-gray-400" />
                  <span>
                    Attendant:{" "}
                    <span className="font-medium text-gray-700">
                      {record.attendantStaffName}
                    </span>
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
              {record.balanceAfter.toFixed(2)}L remaining
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
