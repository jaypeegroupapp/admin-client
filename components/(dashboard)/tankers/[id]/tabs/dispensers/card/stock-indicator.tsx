"use client";

interface StockIndicatorProps {
  totalDispensed: number;
}

export function StockIndicator({ totalDispensed }: StockIndicatorProps) {
  const getStockColor = () => {
    if (totalDispensed <= 100) return "text-red-600";
    if (totalDispensed <= 500) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <p className="text-sm text-gray-500">
      Total Dispensed:{" "}
      <span className={`font-medium ${getStockColor()}`}>{totalDispensed}L</span>
    </p>
  );
}
