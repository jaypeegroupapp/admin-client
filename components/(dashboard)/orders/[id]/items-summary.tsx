// src/components/(dashboard)/orders/[id]/order-items-summary.tsx
"use client";

export function OrderItemsSummary({
  totalQuantity,
  totalAmount,
  itemCount,
}: {
  totalQuantity: number;
  totalAmount: number;
  itemCount: number;
}) {
  return (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Total Litres</p>
          <p className="text-xl font-bold text-gray-800">{totalQuantity}L</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-green-600">
            R {totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Items Count</p>
          <p className="text-xl font-bold text-blue-600">{itemCount}</p>
        </div>
      </div>
    </div>
  );
}
