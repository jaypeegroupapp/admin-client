"use client";

import { StockLevelPreview } from "./stock-level";
import { FinancialPreview } from "./financial";

interface PreviewProps {
  quantityAdded: number;
  currentStock: number;
  capacity: number;
  invoiceUnitPrice: number;
  gridAtPurchase: number;
  discount: number;
  showFinancialFields: boolean;
}

export function RestockPreview({
  quantityAdded,
  currentStock,
  capacity,
  invoiceUnitPrice,
  gridAtPurchase,
  discount,
  showFinancialFields,
}: PreviewProps) {
  if (quantityAdded === 0) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Calculation Preview</h3>

      <StockLevelPreview
        quantityAdded={quantityAdded}
        currentStock={currentStock}
        capacity={capacity}
      />

      {showFinancialFields && invoiceUnitPrice > 0 && (
        <FinancialPreview
          quantityAdded={quantityAdded}
          invoiceUnitPrice={invoiceUnitPrice}
          gridAtPurchase={gridAtPurchase}
          discount={discount}
        />
      )}
    </div>
  );
}
