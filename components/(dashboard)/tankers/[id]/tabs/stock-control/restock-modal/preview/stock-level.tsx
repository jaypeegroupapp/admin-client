"use client";

interface StockLevelPreviewProps {
  quantityAdded: number;
  currentStock: number;
  capacity: number;
}

export function StockLevelPreview({
  quantityAdded,
  currentStock,
  capacity,
}: StockLevelPreviewProps) {
  const newStock = currentStock + quantityAdded;
  const willExceedCapacity = newStock > capacity;

  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Current Stock:</span>
        <span className="font-medium">{currentStock}L</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Added:</span>
        <span className="font-medium text-green-600">
          +{quantityAdded.toFixed(1)}L
        </span>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-1">
        <span className="text-gray-600">New Stock Level:</span>
        <span
          className={`font-medium ${
            willExceedCapacity ? "text-red-600" : "text-green-600"
          }`}
        >
          {newStock}L {willExceedCapacity && "(Exceeds capacity!)"}
        </span>
      </div>
    </div>
  );
}
