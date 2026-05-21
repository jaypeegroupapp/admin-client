"use client";

import { StockLevelPreview } from "./stock-level";
import { VariancePreview } from "./variance";
import { FinancialPreview } from "./financial";

interface PreviewProps {
  quantityAdded: number;
  currentStock: number;
  capacity: number;
  actualMeterReading: number;
  expectedClosing: number;
  variance: number;
  variancePercent: string;
  invoiceUnitPrice: number;
  gridAtPurchase: number;
  discount: number;
  showFinancialFields: boolean;
}

export function RestockPreview({
  quantityAdded,
  currentStock,
  capacity,
  actualMeterReading,
  expectedClosing,
  variance,
  variancePercent,
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

      <VariancePreview
        currentStock={currentStock}
        quantityAdded={quantityAdded}
        expectedClosing={expectedClosing}
        actualMeterReading={actualMeterReading}
        variance={variance}
        variancePercent={variancePercent}
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
