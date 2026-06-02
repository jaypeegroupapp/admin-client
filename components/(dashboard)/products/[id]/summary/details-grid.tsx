"use client";

import { Layout, Tag, DollarSign, Gauge, Fuel } from "lucide-react";
import { IProduct } from "@/definitions/product";

export function ProductDetailsGrid({
  product,
  purchasePrice,
  tankerTotalCapacity,
}: {
  product: IProduct;
  purchasePrice: number;
  tankerTotalCapacity: number;
}) {
  const minThreshold = product.minStockThreshold ?? 1000;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <Layout size={16} className="text-gray-500" />
        <span>Grid: R{(product.grid ?? 0).toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-gray-500" />
        <span>Cost Price: R{purchasePrice.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign size={16} className="text-gray-500" />
        <span>Discount: R{(product.discount ?? 0).toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Gauge size={16} className="text-gray-500" />
        <span>Min Threshold: {minThreshold.toLocaleString()}L</span>
      </div>
      <div className="flex items-center gap-2">
        <Fuel size={16} className="text-gray-500" />
        <span>Total Capacity: {tankerTotalCapacity.toLocaleString()}L</span>
      </div>
    </div>
  );
}
