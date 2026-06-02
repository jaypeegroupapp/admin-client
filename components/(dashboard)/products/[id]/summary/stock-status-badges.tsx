"use client";

export function StockStatusBadges({
  isOverbooked,
  isLowStock,
  reservedStock,
  totalOrderQuantity,
}: {
  isOverbooked: boolean;
  isLowStock: boolean;
  reservedStock: number;
  totalOrderQuantity: number;
}) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          isOverbooked
            ? "bg-red-100 text-red-700"
            : isLowStock
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
        }`}
      >
        {isOverbooked
          ? "⚠️ Overbooked"
          : isLowStock
            ? "⚠️ Below Threshold"
            : "✓ Stock Healthy"}
      </span>
      {reservedStock > 0 && (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
          {reservedStock.toLocaleString()}L Reserved
        </span>
      )}
      {totalOrderQuantity > 0 && (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
          {totalOrderQuantity.toLocaleString()}L Pending
        </span>
      )}
    </div>
  );
}
