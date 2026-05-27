"use client";

interface StockIndicatorProps {
  currentStock: number;
}

export function StockIndicator({ currentStock }: StockIndicatorProps) {
  const getStockColor = () => {
    if (currentStock <= 100) return "text-red-600";
    if (currentStock <= 500) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <p className="text-sm text-gray-500">
      Current Stock:{" "}
      <span className={`font-medium ${getStockColor()}`}>{currentStock}L</span>
    </p>
  );
}
