"use client";

import { StockLevelPreview } from "./stock-level";
import { VariancePreview } from "./variance";
import { FinancialPreview } from "./financial";

interface PreviewProps {
  quantityAdded: number;
  currentStock: number;
  capacity: number;
  actualMeterReading: number;
  manualDippingReading: number;
  expectedClosing: number;
  meterVariance: number;
  meterVariancePercent: string;
  dippingVariance: number;
  dippingVariancePercent: string;
  invoiceUnitPrice: number;
  gridAtPurchase: number;
  discount: number;
}

export function RestockPreview({
  quantityAdded,
  currentStock,
  capacity,
  actualMeterReading,
  manualDippingReading,
  expectedClosing,
  meterVariance,
  meterVariancePercent,
  dippingVariance,
  dippingVariancePercent,
  invoiceUnitPrice,
  gridAtPurchase,
  discount,
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
        meterVariance={meterVariance}
        meterVariancePercent={meterVariancePercent}
        manualDippingReading={manualDippingReading}
        dippingVariance={dippingVariance}
        dippingVariancePercent={dippingVariancePercent}
      />

      <FinancialPreview
        quantityAdded={quantityAdded}
        invoiceUnitPrice={invoiceUnitPrice}
        gridAtPurchase={gridAtPurchase}
        discount={discount}
      />
    </div>
  );
}
