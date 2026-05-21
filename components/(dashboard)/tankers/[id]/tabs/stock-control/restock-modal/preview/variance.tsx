"use client";

interface VariancePreviewProps {
  currentStock: number;
  quantityAdded: number;
  expectedClosing: number;
  actualMeterReading: number;
  variance: number;
  variancePercent: string;
}

export function VariancePreview({
  currentStock,
  quantityAdded,
  expectedClosing,
  actualMeterReading,
  variance,
  variancePercent,
}: VariancePreviewProps) {
  const getVarianceColor = () => {
    if (Math.abs(variance) < 0.1) return "bg-green-100 text-green-700";
    if (Math.abs(variance) < 1) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-1 text-sm border-t border-gray-200 pt-2">
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
      <div className="flex justify-between">
        <span className="text-gray-600">Expected Closing:</span>
        <span className="font-medium">{expectedClosing.toFixed(1)}L</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Actual Reading:</span>
        <span className="font-medium">{actualMeterReading.toFixed(1)}L</span>
      </div>
      {actualMeterReading > 0 && (
        <div
          className={`flex justify-between font-medium p-2 rounded mt-1 ${getVarianceColor()}`}
        >
          <span>Variance:</span>
          <span>
            {variance > 0 ? "+" : ""}
            {variance.toFixed(2)}L ({variancePercent}%)
          </span>
        </div>
      )}
    </div>
  );
}
