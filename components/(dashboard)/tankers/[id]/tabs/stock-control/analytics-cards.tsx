"use client";

interface AnalyticsCardsProps {
  currentStock: number;
  capacity: number;
  analytics: any;
  totalCost?: number;
  totalPotentialRevenue?: number;
}

export function AnalyticsCards({
  currentStock,
  capacity,
  analytics,
  totalCost = 0,
  totalPotentialRevenue = 0,
}: AnalyticsCardsProps) {
  if (!analytics) return null;

  const profitMargin =
    totalCost > 0 ? ((totalPotentialRevenue - totalCost) / totalCost) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
        <p className="text-xs text-purple-600 font-medium">Total Received</p>
        <p className="text-2xl font-bold text-purple-700">
          {analytics.totalReceived?.toFixed(1) || 0}L
        </p>
      </div>
      <div className="bg-orange-50 rounded-lg p-4">
        <p className="text-xs text-orange-600 font-medium">Fill Rate</p>
        <p className="text-2xl font-bold text-orange-700">
          {((currentStock / capacity) * 100).toFixed(1)}%
        </p>
      </div>
      <div className="bg-teal-50 rounded-lg p-4">
        <p className="text-xs text-teal-600 font-medium">Profit Margin</p>
        <p className="text-2xl font-bold text-teal-700">
          {profitMargin.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
