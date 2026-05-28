"use client";

interface VarianceBadgeProps {
  variancePercent: number;
}

export function VarianceBadge({ variancePercent }: VarianceBadgeProps) {
  const absVariance = Math.abs(variancePercent);

  if (absVariance < 0.1) {
    return <span className="text-green-600 text-xs font-medium">✓ Exact</span>;
  } else if (absVariance < 15) {
    return (
      <span className="text-yellow-600 text-xs font-medium">
        ⚠ Small variance
      </span>
    );
  } else {
    return (
      <span className="text-red-600 text-xs font-medium">
        ❗ Large variance
      </span>
    );
  }
}
