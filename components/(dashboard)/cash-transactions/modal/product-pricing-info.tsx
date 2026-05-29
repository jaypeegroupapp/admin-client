"use client";

import { Droplet } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function ProductPricingInfo({
  item,
}: {
  item: ICashTransactionAggregated;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
          <div>
            <p className="text-xs text-gray-500">Product</p>
            <p className="font-medium">{item.productName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
          <Droplet size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Litres</p>
            <p className="font-medium text-blue-600">{item.litres}L</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg space-y-2 print:bg-white print:border print:border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Grid Price:</span>
          <span className="font-medium">R {item.grid}/L</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Plus/Discount:</span>
          <span className="font-medium">R {item.plusDiscount}/L</span>
        </div>
        <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2 print:border-gray-300">
          <span>Total Amount:</span>
          <span className="text-green-600">R {item.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
