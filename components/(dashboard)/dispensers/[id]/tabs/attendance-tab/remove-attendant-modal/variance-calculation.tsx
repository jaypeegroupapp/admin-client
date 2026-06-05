"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

interface VarianceCalculationProps {
  expectedClosing: number;
  actualClosing: number;
  variance: number;
  variancePercent: number;
  totalSold: number;
}

export function VarianceCalculation({
  expectedClosing,
  actualClosing,
  variance,
  variancePercent,
  totalSold,
}: VarianceCalculationProps) {
  const absVariancePercent = Math.abs(variancePercent);

  const getVarianceStatus = () => {
    if (absVariancePercent < 0.1) {
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: CheckCircle,
        text: "✓ Exact match",
        borderColor: "border-green-200",
      };
    } else if (absVariancePercent < 5) {
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        icon: AlertTriangle,
        text: "⚠ Small variance",
        borderColor: "border-yellow-200",
      };
    } else {
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: AlertTriangle,
        text: "❗ Large variance - Investigate",
        borderColor: "border-red-200",
      };
    }
  };

  const varianceStatus = getVarianceStatus();
  const VarianceIcon = varianceStatus.icon;

  return (
    <div
      className={`${varianceStatus.bg} border ${varianceStatus.borderColor} p-4 rounded-lg space-y-2`}
    >
      <div className="flex items-start gap-2">
        <VarianceIcon size={20} className={varianceStatus.color} />
        <p className={`text-sm font-medium ${varianceStatus.color}`}>
          {varianceStatus.text}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div>
          <p className="text-xs text-gray-500">Expected</p>
          <p className="font-medium">{expectedClosing.toLocaleString()}L</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Actual</p>
          <p className="font-medium">{actualClosing.toLocaleString()}L</p>
        </div>
        <div className="col-span-2 border-t border-gray-200 pt-2">
          <p className="text-xs text-gray-500">Variance</p>
          <p className={`text-lg font-semibold ${varianceStatus.color}`}>
            {variance > 0 ? "+" : ""}
            {variance.toFixed(2)}L
            <span className="text-sm ml-1">
              ({Math.abs(variancePercent).toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Help text for first shift */}
      {expectedClosing === totalSold && totalSold > 0 && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          ℹ️ First shift: Expected closing equals total dispensed because
          opening was 0.
        </div>
      )}
    </div>
  );
}
