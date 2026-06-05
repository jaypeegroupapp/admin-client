"use client";

import { Info } from "lucide-react";

interface ShiftSummaryProps {
  openingBalance: number;
  totalSold: number;
  expectedClosing: number;
  isFirstShift: boolean;
}

export function ShiftSummary({
  openingBalance,
  totalSold,
  expectedClosing,
  isFirstShift,
}: ShiftSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Shift Summary</h3>

      {isFirstShift && (
        <div className="p-2 bg-blue-100 rounded-lg mb-2">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-blue-600" />
            <p className="text-xs text-blue-700">
              First shift on this dispenser. Opening meter is 0, which is
              correct.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Opening Meter</p>
          <p className="text-lg font-semibold">
            {openingBalance.toLocaleString()}L
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Dispensed</p>
          <p className="text-lg font-semibold text-green-600">
            +{totalSold.toLocaleString()}L
          </p>
        </div>
        <div className="col-span-2 border-t border-gray-200 pt-2">
          <p className="text-xs text-gray-500">Expected Closing Meter</p>
          <p className="text-lg font-semibold text-blue-600">
            {expectedClosing.toLocaleString()}L
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Opening + Dispensed = {openingBalance} + {totalSold} ={" "}
            {expectedClosing}L
          </p>
        </div>
      </div>
    </div>
  );
}
