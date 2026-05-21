"use client";

interface FinancialPreviewProps {
  quantityAdded: number;
  invoiceUnitPrice: number;
  gridAtPurchase: number;
  discount: number;
}

export function FinancialPreview({
  quantityAdded,
  invoiceUnitPrice,
  gridAtPurchase,
  discount,
}: FinancialPreviewProps) {
  const totalCost = quantityAdded * invoiceUnitPrice;
  const discountedTotal =
    discount > 0 ? totalCost * (1 - discount / 100) : totalCost;
  const savings = totalCost - discountedTotal;
  const potentialRevenue = quantityAdded * gridAtPurchase;
  const profit = potentialRevenue - discountedTotal;
  const profitMargin =
    discountedTotal > 0 ? ((profit / discountedTotal) * 100).toFixed(1) : "0";

  return (
    <div className="border-t border-gray-200 pt-3 mt-2">
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Financial Summary
      </h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-medium">R{invoiceUnitPrice.toFixed(2)}/L</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Cost:</span>
          <span className="font-medium">R{totalCost.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-green-600">{discount}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discounted Total:</span>
              <span className="font-medium text-green-600">
                R{discountedTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Savings:</span>
              <span className="font-medium text-green-600">
                R{savings.toFixed(2)}
              </span>
            </div>
          </>
        )}

        {gridAtPurchase > 0 && (
          <>
            <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
              <span className="text-gray-600">Selling Price:</span>
              <span className="font-medium">
                R{gridAtPurchase.toFixed(2)}/L
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Potential Revenue:</span>
              <span className="font-medium">
                R{potentialRevenue.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Profit:</span>
              <span
                className={`font-medium ${
                  profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R{profit.toFixed(2)} ({profitMargin}%)
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
