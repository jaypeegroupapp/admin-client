"use client";

interface VolumeCalculationSectionProps {
  record: any;
}

export function VolumeCalculationSection({
  record,
}: VolumeCalculationSectionProps) {
  const getMeterVarianceColor = () => {
    if (Math.abs(record.meterVariance) < 0.1) return "text-green-600";
    if (Math.abs(record.meterVariance) < 1) return "text-yellow-600";
    return "text-red-600";
  };

  const getDippingVarianceColor = () => {
    if (Math.abs(record.dippingVariance) < 0.1) return "text-green-600";
    if (Math.abs(record.dippingVariance) < 1) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Volume Verification
      </h4>
      <div className="space-y-3">
        {/* Expected Calculation */}
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
            <span className="font-medium">
              {record.expectedClosingBalance}L
            </span>
          </div>
        </div>

        {/* Meter Reading Variance */}
        <div className="bg-white p-2 rounded border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">
              ATG Meter Reading:
            </span>
            <span className="font-medium">{record.actualMeterReading}L</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Variance:</span>
            <span className={`font-medium ${getMeterVarianceColor()}`}>
              {record.meterVariance > 0 ? "+" : ""}
              {record.meterVariance?.toFixed(2) || "0"}L
              <span className="text-xs ml-1">
                ({record.meterVariancePercentage?.toFixed(1) || "0"}%)
              </span>
            </span>
          </div>
        </div>

        {/* Manual Dipping Reading Variance */}
        <div className="bg-white p-2 rounded border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">
              Manual Dipping Reading:
            </span>
            <span className="font-medium">{record.manualDippingReading}L</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Variance:</span>
            <span className={`font-medium ${getDippingVarianceColor()}`}>
              {record.dippingVariance > 0 ? "+" : ""}
              {record.dippingVariance?.toFixed(2) || "0"}L
              <span className="text-xs ml-1">
                ({record.dippingVariancePercentage?.toFixed(1) || "0"}%)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
