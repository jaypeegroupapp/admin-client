// src/components/(dashboard)/dispensers/[id]/usage-empty-state.tsx
"use client";

import { Droplet } from "lucide-react";
import { TransactionFilter } from "./";

interface UsageEmptyStateProps {
  filter: TransactionFilter;
}

export function UsageEmptyState({ filter }: UsageEmptyStateProps) {
  const getMessage = () => {
    if (filter === "all") {
      return "No usage records found for this dispenser.";
    }
    if (filter === "orders") {
      return "No order transactions found.";
    }
    return "No cash transactions found.";
  };

  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Droplet size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">{getMessage()}</p>
    </div>
  );
}
