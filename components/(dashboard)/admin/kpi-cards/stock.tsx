"use client";

import { Fuel, TrendingUp } from "lucide-react";

interface StockCardProps {
  totalStock: number;
  totalCapacity: number;
  utilizationPercentage: number;
}

export function StockCard({
  totalStock,
  totalCapacity,
  utilizationPercentage,
}: StockCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalStock.toLocaleString()}L
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Capacity: {totalCapacity.toLocaleString()}L
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Fuel size={24} className="text-blue-600" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Utilization</span>
          <span>{utilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${utilizationPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
