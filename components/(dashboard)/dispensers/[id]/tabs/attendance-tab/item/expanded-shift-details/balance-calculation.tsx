"use client";

import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

interface BalanceCalculationProps {
  record: IDispenserAttendanceRecord;
}

export function BalanceCalculation({ record }: BalanceCalculationProps) {
  const openingBalance = record.openingBalanceLitres || 0;
  const totalDispensed = record.totalDispensed || 0;

  // CORRECT FORMULA: Meter reading increases as product is dispensed
  const expectedClosing = openingBalance + totalDispensed;
  const variance = record.variance || 0;

  // Calculate variance percentage based on expected closing or total dispensed
  let variancePercent = 0;
  if (expectedClosing > 0) {
    variancePercent = (variance / expectedClosing) * 100;
  } else if (totalDispensed > 0) {
    variancePercent = (variance / totalDispensed) * 100;
  }

  const getVarianceColor = () => {
    if (Math.abs(variance) < 0.1) return "bg-green-100 text-green-700";
    if (Math.abs(variance) < 1) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const isFirstShift = openingBalance === 0 && totalDispensed > 0;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Meter Calculations
      </h4>
      <div className="space-y-2">
        {/* Opening Meter */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Opening Meter:</span>
          <span className="font-medium">
            {openingBalance.toLocaleString()}L
          </span>
        </div>

        {/* Total Dispensed (Added, not subtracted) */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Dispensed:</span>
          <span className="font-medium text-green-600">
            +{(totalDispensed || 0).toLocaleString()}L
          </span>
        </div>

        {/* Expected Closing */}
        <div className="flex justify-between text-sm border-t border-gray-200 pt-1">
          <span className="text-gray-600">Expected Closing:</span>
          <span className="font-medium text-blue-600">
            {expectedClosing.toLocaleString()}L
          </span>
        </div>
        <p className="text-xs text-gray-400 -mt-1 mb-1">
          Opening + Dispensed = {openingBalance} + {totalDispensed} ={" "}
          {expectedClosing}L
        </p>

        {/* Actual Closing */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Actual Closing:</span>
          <span className="font-medium">
            {record.closingBalanceLitres?.toLocaleString() || "—"}L
          </span>
        </div>

        {/* Variance */}
        {record.closingBalanceLitres !== undefined && (
          <div
            className={`flex justify-between text-sm font-medium p-2 rounded mt-1 ${getVarianceColor()}`}
          >
            <span>Variance:</span>
            <span>
              {variance > 0 ? "+" : ""}
              {variance.toFixed(2)}L
              <span className="text-xs ml-1">
                ({Math.abs(variancePercent).toFixed(1)}%)
              </span>
            </span>
          </div>
        )}

        {/* First Shift Note */}
        {isFirstShift && record.closingBalanceLitres && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            ℹ️ First shift: Meter started at 0, dispensed {totalDispensed}L,
            expected closing {expectedClosing}L
          </div>
        )}
      </div>
    </div>
  );
}
