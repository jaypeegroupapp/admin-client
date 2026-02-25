"use client";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { IProduct } from "@/definitions/product";
import Link from "next/link";

export function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link href={`/products/${product.id}`} className="block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="
          bg-white rounded-2xl border border-gray-200 p-4 shadow-sm 
          hover:shadow-md transition-all flex flex-col justify-between
          cursor-pointer
        "
      >
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            <Package />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              R{product.grid?.toFixed(2)} | Stock: {product.stock}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              product.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {product.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
