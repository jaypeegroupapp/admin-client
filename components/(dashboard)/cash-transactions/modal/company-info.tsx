"use client";

import { Factory } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function CompanyInfo({ item }: { item: ICashTransactionAggregated }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
      <Factory size={16} className="text-gray-500" />
      <div>
        <p className="text-xs text-gray-500">Company</p>
        <p className="font-medium">{item.companyName}</p>
      </div>
    </div>
  );
}