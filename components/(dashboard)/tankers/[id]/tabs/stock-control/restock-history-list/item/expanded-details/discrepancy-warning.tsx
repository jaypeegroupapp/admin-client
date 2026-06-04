"use client";

import { AlertTriangle } from "lucide-react";

interface DiscrepancyWarningProps {
  record: any;
}

export function DiscrepancyWarning({ record }: DiscrepancyWarningProps) {
  if (record.status !== "discrepancy") return null;

  const hasMeterVariance = Math.abs(record.meterVariance) >= 0.1;
  const hasDippingVariance = Math.abs(record.dippingVariance) >= 0.1;

  return (
    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-red-500 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-700">
            Discrepancy Detected
          </p>
          <div className="mt-2 space-y-1 text-xs text-red-600">
            {hasMeterVariance && (
              <p>
                • Meter variance: {record.meterVariance > 0 ? "+" : ""}
                {record.meterVariance?.toFixed(2)}L (
                {record.meterVariancePercentage?.toFixed(1) || "0"}%)
              </p>
            )}
            {hasDippingVariance && (
              <p>
                • Dipping variance: {record.dippingVariance > 0 ? "+" : ""}
                {record.dippingVariance?.toFixed(2)}L (
                {record.dippingVariancePercentage?.toFixed(1) || "0"}%)
              </p>
            )}
          </div>
          <p className="text-xs text-red-700 mt-2">
            Please investigate possible leak, theft, meter calibration issue, or
            manual dipping error.
          </p>
        </div>
      </div>
    </div>
  );
}
