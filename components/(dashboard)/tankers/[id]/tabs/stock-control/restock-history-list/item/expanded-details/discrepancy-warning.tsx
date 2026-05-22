"use client";

import { AlertTriangle } from "lucide-react";

interface DiscrepancyWarningProps {
  record: any;
}

export function DiscrepancyWarning({ record }: DiscrepancyWarningProps) {
  if (record.status !== "discrepancy") return null;

  return (
    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
      <AlertTriangle size={16} className="text-red-500 mt-0.5" />
      <p className="text-xs text-red-700">
        Variance of {record.variance.toFixed(2)}L (
        {record.variancePercentage?.toFixed(1) || "0"}%) detected. Please
        investigate possible leak, theft, or meter calibration issue.
      </p>
    </div>
  );
}
