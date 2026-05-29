"use client";

import { Calendar } from "lucide-react";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function TransactionStatus({
  item,
}: {
  item: ICashTransactionAggregated;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
          item.status === "completed"
            ? "bg-green-100 text-green-700"
            : item.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
        }`}
      >
        {item.status}
      </span>
      <span className="text-sm text-gray-500 flex items-center gap-1">
        <Calendar size={14} />
        {new Date(item.createdAt).toLocaleString("en-ZA")}
      </span>
    </div>
  );
}
