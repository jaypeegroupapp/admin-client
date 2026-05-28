"use client";

import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

interface BalanceCalculationProps {
  record: IDispenserAttendanceRecord;
}

export function BalanceCalculation({ record }: BalanceCalculationProps) {
  const expectedClosing =
    record.openingBalanceLitres - (record.totalDispensed || 0);
  const variance = record.variance || 0;
  const variancePercent =
    record.openingBalanceLitres > 0
      ? (variance / record.openingBalanceLitres) * 100
      : 0;

  const getVarianceColor = () => {
    if (Math.abs(variance) < 0.1) return "bg-green-100 text-green-700";
    if (Math.abs(variance) < 1) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Meter Calculations
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Opening Meter:</span>
          <span className="font-medium">
            {record.openingBalanceLitres.toLocaleString()}L
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Dispensed:</span>
          <span className="font-medium text-red-600">
            -{(record.totalDispensed || 0).toLocaleString()}L
          </span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-200 pt-1">
          <span className="text-gray-600">Expected Closing:</span>
          <span className="font-medium">
            {expectedClosing.toLocaleString()}L
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Actual Closing:</span>
          <span className="font-medium">
            {record.closingBalanceLitres?.toLocaleString() || "—"}L
          </span>
        </div>
        {record.closingBalanceLitres && (
          <div
            className={`flex justify-between text-sm font-medium p-2 rounded mt-1 ${getVarianceColor()}`}
          >
            <span>Variance:</span>
            <span>
              {variance > 0 ? "+" : ""}
              {variance.toFixed(2)}L
              <span className="text-xs ml-1">
                ({variancePercent.toFixed(1)}%)
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
