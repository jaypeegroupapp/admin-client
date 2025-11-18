"use client";

import { Package, Tag, Layers } from "lucide-react";
import { IProduct } from "@/definitions/product";

export function ProductSummary({ product }: { product: IProduct }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Package size={28} />
        </div>

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
      </div>

      <div className="border-t border-gray-200 my-4" />

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-500" />
          <span>Selling Price: R{(product.sellingPrice ?? 0).toFixed(2)}</span>
        </div>{" "}
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-500" />
          <span>Cost Price: R{(product.costPrice ?? 0).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-gray-500" />
          <span>Stock: {product.stock}</span>
        </div>
        <div className="col-span-2">
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              product.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {product.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>
    </div>
  );
}
