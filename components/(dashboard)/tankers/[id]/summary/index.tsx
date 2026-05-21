"use client";

import {
  Fuel,
  Package,
  Calendar,
  TrendingUp,
  Droplet,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { ITanker } from "@/definitions/tanker";
import { IProduct } from "@/definitions/product";
import { EnableDisableTankerModal } from "./enable-disable-modal";

export function TankerSummary({
  tanker,
  product,
  connectedDispensersCount,
}: {
  tanker: ITanker;
  product: IProduct | null | undefined;
  connectedDispensersCount: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const fillPercentage = (tanker.stockLevel / tanker.capacity) * 100;

  const getStockColor = () => {
    if (fillPercentage <= 20) return "text-red-600";
    if (fillPercentage <= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressBarColor = () => {
    if (fillPercentage <= 20) return "bg-red-500";
    if (fillPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
          <Fuel size={32} />
        </div>

        <div className="flex justify-between flex-1 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">
              {tanker.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Capacity: <span className="font-medium">{tanker.capacity}L</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Created on{" "}
              {new Date(tanker.createdAt!).toLocaleDateString("en-ZA")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Status:{" "}
              <strong
                className={
                  tanker.isPublished ? "text-green-600" : "text-red-600"
                }
              >
                {tanker.isPublished ? "Active" : "Inactive"}
              </strong>
            </span>

            <div
              onClick={() => setModalOpen(true)}
              className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition
                ${tanker.isPublished ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform
                  ${tanker.isPublished ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span>Product: {product?.name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplet size={16} className="text-gray-500" />
          <span>
            Current Stock:{" "}
            <strong className={getStockColor()}>{tanker.stockLevel}L</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-gray-500" />
          <span>Connected Dispensers: {connectedDispensersCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span>
            Last Updated:{" "}
            {new Date(tanker.updatedAt!).toLocaleDateString("en-ZA")}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Stock Level</span>
          <span className={getStockColor()}>{fillPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} rounded-full transition-all`}
            style={{ width: `${Math.min(fillPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Empty</span>
          <span>
            {tanker.stockLevel}L / {tanker.capacity}L
          </span>
          <span>Full</span>
        </div>
      </div>

      {fillPercentage <= 20 && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-xs text-red-600">
            Low stock alert! Please refill soon.
          </p>
        </div>
      )}

      <EnableDisableTankerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tankerId={tanker.id!}
        currentState={tanker.isPublished!}
      />
    </div>
  );
}
