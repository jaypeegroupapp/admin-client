"use client";

import { Banknote } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function TransactionReference({
  item,
}: {
  item: ICashTransactionAggregated;
}) {
  const transactionNumber = item.id?.slice(-6).toUpperCase();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
      <Banknote size={16} className="text-gray-500" />
      <div>
        <p className="text-xs text-gray-500">Transaction Reference</p>
        <p className="font-mono font-bold">{transactionNumber}</p>
      </div>
    </div>
  );
}
