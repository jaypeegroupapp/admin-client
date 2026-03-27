// src/components/(dashboard)/dispensers/[id]/usage-table-row.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Banknote, Truck, User, Package } from "lucide-react";
import { getStockRemainingPercentage, getTransactionType } from "@/lib/usage";

export function UsageTableRow({ record }: { record: any }) {
  const type = getTransactionType(record);
  const TypeIcon = type.icon;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hover:bg-gray-50 transition"
    >
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {new Date(record.timestamp).toLocaleDateString("en-ZA")}
        <br />
        <span className="text-xs text-gray-400">
          {new Date(record.timestamp).toLocaleTimeString("en-ZA")}
        </span>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${type.bgColor}`}>
            <TypeIcon size={12} className={type.textColor} />
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.bgColor} ${type.textColor}`}
          >
            {type.label}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-800">
          {record.litresDispensed}L
        </span>
      </td>

      <td className="px-4 py-3">
        {record.cashTransactionId ? (
          <div className="text-sm">
            {record.metadata?.companyName && (
              <p className="flex items-center gap-1">
                <Package size={12} className="text-gray-400" />
                {record.metadata.companyName}
              </p>
            )}
            {record.metadata?.plateNumber && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <Truck size={10} />
                {record.metadata.plateNumber}
              </p>
            )}
            {record.metadata?.driverName && (
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <User size={10} />
                {record.metadata.driverName}
              </p>
            )}
          </div>
        ) : record.orderId ? (
          <Link
            href={type.link || "#"}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ShoppingCart size={12} />
            Order #{record.orderNumber?.slice(-6) || "View"}
          </Link>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap">
        {record.balanceBefore && record.balanceAfter && (
          <div className="w-24">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">
                {record.balanceAfter.toFixed(0)}L
              </span>
              <span className="text-gray-500">
                {record.balanceBefore.toFixed(0)}L
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${getStockRemainingPercentage(record.balanceBefore, record.balanceAfter)}%`,
                }}
              />
            </div>
          </div>
        )}
      </td>

      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
        {record.attendantStaffName ? (
          <div className="flex items-center gap-1">
            <User size={12} className="text-gray-400" />
            <span>{record.attendantStaffName}</span>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </motion.tr>
  );
}
