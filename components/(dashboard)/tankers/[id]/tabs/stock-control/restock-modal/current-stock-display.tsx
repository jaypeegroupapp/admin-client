"use client";

export function CurrentStockDisplay({
  currentStock,
  capacity,
}: {
  currentStock: number;
  capacity: number;
}) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <p className="text-sm text-blue-600 font-medium">Current Stock</p>
      <p className="text-2xl font-bold text-blue-700">{currentStock}L</p>
      <p className="text-xs text-blue-600 mt-1">Capacity: {capacity}L</p>
    </div>
  );
}
