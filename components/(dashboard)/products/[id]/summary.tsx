"use client";

import {
  Package,
  Tag,
  Layers,
  DollarSign,
  Layout,
  AlertTriangle,
  Gauge,
  Fuel,
} from "lucide-react";
import { useState } from "react";
import { IProduct } from "@/definitions/product";
import { EnableDisableProductModal } from "./enable-disable-modal";

export function ProductSummary({
  product,
  totalOrderQuantity,
  tankerTotalStock,
  tankerTotalCapacity,
}: {
  product: IProduct;
  totalOrderQuantity: number;
  tankerTotalStock: number;
  tankerTotalCapacity: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const purchasePrice = (product.grid ?? 0) - (product.discount ?? 0);
  const minThreshold = product.minStockThreshold ?? 1000;
  const isLowStock = tankerTotalStock < minThreshold;

  // Calculate percentages for the progress bar
  const stockPercentage =
    tankerTotalCapacity > 0
      ? Math.min(100, (tankerTotalStock / tankerTotalCapacity) * 100)
      : 0;
  const thresholdPercentage =
    tankerTotalCapacity > 0
      ? Math.min(100, (minThreshold / tankerTotalCapacity) * 100)
      : 0;

  const handleToggle = () => {
    setModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* ICON + DETAILS */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Package size={28} />
        </div>

        <div className="flex justify-between flex-1 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>

            <p className="text-sm text-gray-500">{product.description}</p>

            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {new Date(product.createdAt!).toLocaleDateString("en-ZA")}
            </p>
          </div>

          {/* STATUS + SWITCH */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Status:{" "}
              <strong
                className={
                  product.isPublished ? "text-green-600" : "text-red-600"
                }
              >
                {product.isPublished ? "Published" : "Draft"}
              </strong>
            </span>

            {/* TOGGLE SWITCH */}
            <div
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition
                ${product.isPublished ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform
                  ${product.isPublished ? "translate-x-6" : "translate-x-1"}`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      {/* PRODUCT DETAILS GRID */}
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
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-gray-500" />
          <span>Current Stock: {tankerTotalStock.toLocaleString()}L</span>
        </div>
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span>Pending Order: {totalOrderQuantity.toLocaleString()}L</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              totalOrderQuantity > tankerTotalStock
                ? "bg-red-200 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {totalOrderQuantity > tankerTotalStock ? "Restock" : "Available"}
          </span>
        </div>
      </div>

      {/* LOW STOCK ALERT */}
      {isLowStock && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Low Stock Alert!
            </p>
            <p className="text-xs text-red-600">
              Current stock ({tankerTotalStock.toLocaleString()}L) is below the
              minimum threshold of {minThreshold.toLocaleString()}L. Please
              restock soon to avoid shortages.
            </p>
          </div>
        </div>
      )}

      {/* SINGLE COMBINED PROGRESS BAR */}
      <div className="mt-6">
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">
            Stock Level Overview
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
          {/* Current Stock Fill */}
          <div
            className={`absolute left-0 top-0 h-full rounded-l-lg transition-all ${
              isLowStock ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${stockPercentage}%` }}
          />

          {/* Threshold Marker Line */}
          <div
            className="absolute top-0 w-0.5 h-full bg-yellow-500 shadow-md z-10"
            style={{ left: `${thresholdPercentage}%` }}
          />

          {/* Threshold Marker Arrow/Triangle */}
          <div
            className="absolute top-0 w-0 h-0 -translate-x-1/2 z-10"
            style={{ left: `${thresholdPercentage}%` }}
          >
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-yellow-500 -mt-[2px]" />
          </div>
        </div>

        {/* Labels below progress bar */}
        <div className="flex justify-between items-start mt-3 text-xs">
          <div className="text-center flex-1">
            <p className="font-semibold text-gray-800">
              {tankerTotalStock.toLocaleString()}L
            </p>
            <p className="text-gray-500">Current Stock</p>
          </div>
          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <p className="font-semibold text-gray-800">
                {minThreshold.toLocaleString()}L
              </p>
            </div>
            <p className="text-gray-500">Minimum Threshold</p>
          </div>
          <div className="text-center flex-1">
            <p className="font-semibold text-gray-800">
              {tankerTotalCapacity.toLocaleString()}L
            </p>
            <p className="text-gray-500">Total Capacity</p>
          </div>
        </div>
      </div>

      {/* ENABLE/DISABLE MODAL */}
      <EnableDisableProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={product.id!}
        currentState={product.isPublished!}
      />
    </div>
  );
}
