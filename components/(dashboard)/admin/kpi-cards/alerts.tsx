"use client";

import { AlertTriangle } from "lucide-react";

interface AlertsCardProps {
  lowStockCount: number;
}

export function AlertsCard({ lowStockCount }: AlertsCardProps) {
  const hasAlerts = lowStockCount > 0;

  return (
    <div
      className={`rounded-xl shadow-sm border p-5 ${
        hasAlerts ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Active Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
          <p className="text-xs text-gray-400 mt-1">Low stock warnings</p>
        </div>
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-600" />
        </div>
      </div>
      {hasAlerts && (
        <p className="text-xs text-red-600 mt-3">
          ⚠️ Action required on {lowStockCount} tankers
        </p>
      )}
    </div>
  );
}
