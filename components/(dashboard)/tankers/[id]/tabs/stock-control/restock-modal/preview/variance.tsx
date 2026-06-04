"use client";

interface VariancePreviewProps {
  currentStock: number;
  quantityAdded: number;
  expectedClosing: number;
  actualMeterReading: number;
  meterVariance: number;
  meterVariancePercent: string;
  manualDippingReading: number;
  dippingVariance: number;
  dippingVariancePercent: string;
}

export function VariancePreview({
  currentStock,
  quantityAdded,
  expectedClosing,
  actualMeterReading,
  meterVariance,
  meterVariancePercent,
  manualDippingReading,
  dippingVariance,
  dippingVariancePercent,
}: VariancePreviewProps) {
  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 0.1) return "bg-green-100 text-green-700";
    if (Math.abs(variance) < 1) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-3 border-t border-gray-200 pt-3">
      <h4 className="text-xs font-medium text-gray-500">Volume Verification</h4>

      {/* Expected Closing */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Opening Balance:</span>
          <span className="font-medium">{currentStock.toFixed(1)}L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Added:</span>
          <span className="font-medium text-green-600">
            +{quantityAdded.toFixed(1)}L
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1">
          <span className="text-gray-600">Expected Closing:</span>
          <span className="font-medium">{expectedClosing.toFixed(1)}L</span>
        </div>
      </div>

      {/* Meter Reading Variance */}
      <div className={`p-2 rounded ${getVarianceColor(meterVariance)}`}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Meter Reading:</span>
          <span className="font-medium">{actualMeterReading.toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Variance:</span>
          <span>
            {meterVariance > 0 ? "+" : ""}
            {meterVariance.toFixed(2)}L ({meterVariancePercent}%)
          </span>
        </div>
      </div>

      {/* Manual Dipping Reading Variance */}
      <div className={`p-2 rounded ${getVarianceColor(dippingVariance)}`}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Manual Dipping Reading:</span>
          <span className="font-medium">
            {manualDippingReading.toFixed(1)}L
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Variance:</span>
          <span>
            {dippingVariance > 0 ? "+" : ""}
            {dippingVariance.toFixed(2)}L ({dippingVariancePercent}%)
          </span>
        </div>
      </div>
    </div>
  );
}
