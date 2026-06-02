"use client";

export function StockProgressBar({
  physicalStock,
  reservedStock,
  minThreshold,
  tankerTotalCapacity,
  isLowStock,
}: {
  physicalStock: number;
  reservedStock: number;
  minThreshold: number;
  tankerTotalCapacity: number;
  isLowStock: boolean;
}) {
  const stockPercentage =
    tankerTotalCapacity > 0
      ? Math.min(100, (physicalStock / tankerTotalCapacity) * 100)
      : 0;
  const thresholdPercentage =
    tankerTotalCapacity > 0
      ? Math.min(100, (minThreshold / tankerTotalCapacity) * 100)
      : 0;
  const reservedPercentage =
    tankerTotalCapacity > 0 && reservedStock > 0
      ? Math.min(100, (reservedStock / tankerTotalCapacity) * 100)
      : 0;

  // Determine physical stock color based on low stock status
  const physicalStockColor = isLowStock ? "bg-red-500" : "bg-green-500";
  const physicalStockTextColor = isLowStock ? "text-red-600" : "text-green-600";

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Stock Level Overview
      </p>

      <div className="relative w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
        {/* Physical Stock Fill */}
        <div
          className={`absolute left-0 top-0 h-full rounded-l-lg transition-all ${physicalStockColor}`}
          style={{ width: `${stockPercentage}%` }}
        />

        {/* Reserved Stock Overlay */}
        {reservedStock > 0 && (
          <div
            className="absolute left-0 top-0 h-full bg-yellow-400 opacity-60 transition-all"
            style={{ width: `${reservedPercentage}%` }}
          />
        )}

        {/* Threshold Marker */}
        <div
          className="absolute top-0 w-0.5 h-full bg-orange-500 shadow-md z-10"
          style={{ left: `${thresholdPercentage}%` }}
        />
        <div
          className="absolute top-0 w-0 h-0 -translate-x-1/2 z-10"
          style={{ left: `${thresholdPercentage}%` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-500 -mt-[2px]" />
        </div>
      </div>

      {/* Labels - Colors now match the progress bar */}
      <div className="flex justify-between items-start mt-3 text-xs">
        {/* Physical Stock Label - matches progress bar color */}
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1">
            <div className={`w-3 h-3 rounded-sm ${physicalStockColor}`}></div>
            <p className={`font-semibold ${physicalStockTextColor}`}>
              {physicalStock.toLocaleString()}L
            </p>
          </div>
          <p className="text-gray-500">Physical Stock</p>
        </div>

        {/* Reserved Stock Label - matches yellow overlay */}
        {reservedStock > 0 && (
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
              <p className="font-semibold text-yellow-700">
                {reservedStock.toLocaleString()}L
              </p>
            </div>
            <p className="text-gray-500">Reserved</p>
          </div>
        )}

        {/* Min Threshold Label - matches orange marker */}
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <p className="font-semibold text-orange-600">
              {minThreshold.toLocaleString()}L
            </p>
          </div>
          <p className="text-gray-500">Min Threshold</p>
        </div>

        {/* Total Capacity Label - grey like the background */}
        <div className="text-center flex-1">
          <div className="w-3 h-3 bg-gray-400 rounded-sm mx-auto mb-1"></div>
          <p className="font-semibold text-gray-700">
            {tankerTotalCapacity.toLocaleString()}L
          </p>
          <p className="text-gray-500">Total Capacity</p>
        </div>
      </div>
    </div>
  );
}
