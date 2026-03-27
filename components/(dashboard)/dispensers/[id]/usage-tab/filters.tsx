// src/components/(dashboard)/dispensers/[id]/usage-filters.tsx
"use client";

import { ShoppingCart, Banknote } from "lucide-react";
import { TransactionFilter } from ".";

interface UsageFiltersProps {
  filter: TransactionFilter;
  onFilterChange: (filter: TransactionFilter) => void;
  counts: {
    all: number;
    orders: number;
    cash: number;
  };
}

export function UsageFilters({
  filter,
  onFilterChange,
  counts,
}: UsageFiltersProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onFilterChange("all")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
          filter === "all"
            ? "bg-gray-800 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All ({counts.all})
      </button>
      <button
        onClick={() => onFilterChange("orders")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
          filter === "orders"
            ? "bg-blue-600 text-white"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
      >
        <ShoppingCart size={14} />
        Orders ({counts.orders})
      </button>
      <button
        onClick={() => onFilterChange("cash")}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1 ${
          filter === "cash"
            ? "bg-green-600 text-white"
            : "bg-green-50 text-green-600 hover:bg-green-100"
        }`}
      >
        <Banknote size={14} />
        Cash ({counts.cash})
      </button>
    </div>
  );
}
