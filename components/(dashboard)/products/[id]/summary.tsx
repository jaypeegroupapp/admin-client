"use client";

import { Package, Tag, Layers } from "lucide-react";
import { useState } from "react";
import { IProduct } from "@/definitions/product";
import { EnableDisableProductModal } from "./enable-disable-modal";

export function ProductSummary({
  product,
  totalOrderQuantity,
}: {
  product: IProduct;
  totalOrderQuantity: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);

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
          <Tag size={16} className="text-gray-500" />
          <span>Grid: R{(product.grid ?? 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-500" />
          <span>Cost Price: R{(product.purchasePrice ?? 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-gray-500" />
          <span>Stock: {product.stock} litres</span>
        </div>{" "}
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span>Pending Order: {totalOrderQuantity} litres</span>
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              totalOrderQuantity > product.stock!
                ? "bg-red-200 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {totalOrderQuantity > product.stock! ? "Restock" : "Available"}
          </span>
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
