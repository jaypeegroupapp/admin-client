"use client";

import { Package } from "lucide-react";
import { IProduct } from "@/definitions/product";

export function ProductHeaderCard({
  product,
  onToggle,
}: {
  product: IProduct;
  onToggle: () => void;
}) {
  return (
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
          <div
            onClick={onToggle}
            className={`relative inline-flex h-6 w-12 cursor-pointer rounded-full transition
              ${product.isPublished ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform
              ${product.isPublished ? "translate-x-6" : "translate-x-1"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
