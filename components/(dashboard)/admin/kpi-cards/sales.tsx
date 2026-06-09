"use client";

import { TrendingUp, Banknote, ShoppingCart } from "lucide-react";

interface SalesCardProps {
  todayLitres: number;
  todayRevenue: number;
  orderCount: number;
  cashCount: number;
}

export function SalesCard({
  todayLitres,
  todayRevenue,
  orderCount,
  cashCount,
}: SalesCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Today's Sales</p>
          <p className="text-2xl font-bold text-gray-900">
            {todayLitres.toLocaleString()}L
          </p>
          <p className="text-lg font-semibold text-green-600">
            R {todayRevenue.toFixed(2)}
          </p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <TrendingUp size={24} className="text-green-600" />
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <ShoppingCart size={12} />
          <span>Orders: {orderCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Banknote size={12} />
          <span>Cash: {cashCount}</span>
        </div>
      </div>
    </div>
  );
}
