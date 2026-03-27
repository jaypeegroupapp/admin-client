// src/components/(dashboard)/dispensers/[id]/usage-stats.tsx
"use client";

interface UsageStatsProps {
  totalLitres: number;
  orderCount: number;
  cashCount: number;
  transactionCount: number;
}

export function UsageStats({
  totalLitres,
  orderCount,
  cashCount,
  transactionCount,
}: UsageStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500">Total Dispensed</p>
        <p className="text-lg font-semibold text-gray-800">{totalLitres}L</p>
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
          {(totalLitres / (transactionCount || 1)).toFixed(1)}L
        </p>
      </div>
    </div>
  );
}
