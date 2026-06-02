"use client";

import { AlertTriangle } from "lucide-react";

export function StockAlerts({
  isOverbooked,
  isLowStock,
  physicalStock,
  reservedStock,
  minThreshold,
}: {
  isOverbooked: boolean;
  isLowStock: boolean;
  physicalStock: number;
  reservedStock: number;
  minThreshold: number;
}) {
  if (isOverbooked) {
    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700">
            ⚠️ Overbooked! Shortfall of{" "}
            {(reservedStock - physicalStock).toLocaleString()}L
          </p>
          <p className="text-xs text-red-600">
            Reserved stock exceeds physical stock. Please restock immediately.
          </p>
        </div>
      </div>
    );
  }

  if (isLowStock) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <AlertTriangle size={20} className="text-yellow-500 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-700">
            Low Stock Alert!
          </p>
          <p className="text-xs text-yellow-600">
            Physical stock ({physicalStock.toLocaleString()}L) is below minimum
            threshold of {minThreshold.toLocaleString()}L.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
