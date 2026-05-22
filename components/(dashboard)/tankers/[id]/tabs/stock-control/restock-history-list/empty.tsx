"use client";

import { Package } from "lucide-react";

export function EmptyRestockState() {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Package size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">No restock records yet</p>
    </div>
  );
}
