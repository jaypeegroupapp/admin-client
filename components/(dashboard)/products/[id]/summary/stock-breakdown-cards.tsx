"use client";

import { Layers, ClipboardCheck, ClipboardList, Package } from "lucide-react";

export function StockBreakdownCards({
  physicalStock,
  reservedStock,
  availableForNewOrders,
  totalOrderQuantity,
}: {
  physicalStock: number;
  reservedStock: number;
  availableForNewOrders: number;
  totalOrderQuantity: number;
}) {
  return (
    <div className="border-t border-gray-200 pt-4 mt-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Stock Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Physical Stock */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Layers size={14} className="text-blue-600" />
            <p className="text-xs font-medium text-blue-700">Physical Stock</p>
          </div>
          <p className="text-xl font-bold text-blue-700">
            {physicalStock.toLocaleString()}L
          </p>
          <p className="text-xs text-blue-600">Sum of all tankers</p>
        </div>

        {/* Reserved Stock */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck size={14} className="text-yellow-600" />
            <p className="text-xs font-medium text-yellow-700">
              Reserved Stock
            </p>
          </div>
          <p className="text-xl font-bold text-yellow-700">
            {reservedStock.toLocaleString()}L
          </p>
          <p className="text-xs text-yellow-600">Sum of accepted orders</p>
        </div>

        {/* Available for New Orders */}
        <div
          className={`rounded-lg p-3 ${availableForNewOrders > 0 ? "bg-green-50" : "bg-red-50"}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList
              size={14}
              className={
                availableForNewOrders > 0 ? "text-green-600" : "text-red-600"
              }
            />
            <p
              className={`text-xs font-medium ${availableForNewOrders > 0 ? "text-green-700" : "text-red-700"}`}
            >
              Available for New Orders
            </p>
          </div>
          <p
            className={`text-xl font-bold ${availableForNewOrders > 0 ? "text-green-700" : "text-red-700"}`}
          >
            {availableForNewOrders.toLocaleString()}L
          </p>
          <p className="text-xs">Physical - Reserved</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Package size={14} className="text-purple-600" />
            <p className="text-xs font-medium text-purple-700">
              Pending Orders
            </p>
          </div>
          <p className="text-xl font-bold text-purple-700">
            {totalOrderQuantity.toLocaleString()}L
          </p>
          <p className="text-xs text-purple-600">Awaiting acceptance</p>
        </div>
      </div>
    </div>
  );
}
