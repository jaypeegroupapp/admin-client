"use client";

import { PackageCheck, Fuel } from "lucide-react";

export function ProductQuantityCard({ item }: { item: any }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
        <div className="bg-white p-2 rounded-lg">
          <PackageCheck size={18} className="text-gray-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Product</p>
          <p className="font-medium">{item.productName || "Diesel"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
        <div className="bg-white p-2 rounded-lg">
          <Fuel size={18} className="text-gray-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Quantity</p>
          <p className="font-medium text-blue-600 text-lg">{item.quantity}L</p>
        </div>
      </div>
    </div>
  );
}
