"use client";

interface VolumeCalculationSectionProps {
  record: any;
}

export function VolumeCalculationSection({
  record,
}: VolumeCalculationSectionProps) {
  const getVarianceColor = () => {
    if (Math.abs(record.variance) < 0.1) return "text-green-600";
    if (Math.abs(record.variance) < 1) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Volume Calculation
      </h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Opening Balance:</span>
          <span className="font-medium">{record.beforeStock}L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Added:</span>
          <span className="font-medium text-green-600">
            +{record.quantityAdded}L
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
          <span className="text-gray-600">Expected Closing:</span>
          <span className="font-medium">{record.expectedClosingBalance}L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Actual Reading:</span>
          <span className="font-medium">{record.actualMeterReading}L</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
          <span className="text-gray-600">Variance:</span>
          {record.variance && record.variance !== 0 && (
            <span className={`font-medium ${getVarianceColor()}`}>
              {record.variance > 0 ? "+" : ""}
              {record.variance.toFixed(2)}L
              <span className="text-xs ml-1">
                ({record.variancePercentage?.toFixed(1) || "0"}%)
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
