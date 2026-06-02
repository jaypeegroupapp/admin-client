"use client";

import { useState } from "react";
import { IProduct } from "@/definitions/product";
import { EnableDisableProductModal } from "./enable-disable-modal";
import { ProductHeaderCard } from "./header-card";
import { ProductDetailsGrid } from "./details-grid";
import { StockBreakdownCards } from "./stock-breakdown-cards";
import { StockAlerts } from "./stock-alerts";
import { StockProgressBar } from "./stock-progress-bar";
import { StockStatusBadges } from "./stock-status-badges";

export function ProductSummary({
  product,
  totalOrderQuantity,
  tankerTotalStock,
  tankerTotalCapacity,
  acceptedOrderQuantity,
}: {
  product: IProduct;
  totalOrderQuantity: number;
  tankerTotalStock: number;
  tankerTotalCapacity: number;
  acceptedOrderQuantity: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const physicalStock = tankerTotalStock;
  const reservedStock = acceptedOrderQuantity;
  const availableForNewOrders = Math.max(0, physicalStock - reservedStock);
  const isOverbooked = reservedStock > physicalStock;
  const isLowStock = physicalStock < (product.minStockThreshold ?? 1000);
  const minThreshold = product.minStockThreshold ?? 1000;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <ProductHeaderCard
        product={product}
        onToggle={() => setModalOpen(true)}
      />

      <ProductDetailsGrid
        product={product}
        purchasePrice={(product.grid ?? 0) - (product.discount ?? 0)}
        tankerTotalCapacity={tankerTotalCapacity}
      />

      <StockBreakdownCards
        physicalStock={physicalStock}
        reservedStock={reservedStock}
        availableForNewOrders={availableForNewOrders}
        totalOrderQuantity={totalOrderQuantity}
      />

      <StockAlerts
        isOverbooked={isOverbooked}
        isLowStock={isLowStock}
        physicalStock={physicalStock}
        reservedStock={reservedStock}
        minThreshold={minThreshold}
      />

      <StockProgressBar
        physicalStock={physicalStock}
        reservedStock={reservedStock}
        minThreshold={minThreshold}
        tankerTotalCapacity={tankerTotalCapacity}
        isLowStock={isLowStock}
      />

      <StockStatusBadges
        isOverbooked={isOverbooked}
        isLowStock={isLowStock}
        reservedStock={reservedStock}
        totalOrderQuantity={totalOrderQuantity}
      />

      <EnableDisableProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={product.id!}
        currentState={product.isPublished!}
      />
    </div>
  );
}
