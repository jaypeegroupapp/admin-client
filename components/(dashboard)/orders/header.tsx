"use client";

import { PackageCheck } from "lucide-react";

export function OrderHeader() {
  return (
    <div className="flex items-center gap-2">
      <PackageCheck className="w-6 h-6 text-gray-700" />
      <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
    </div>
  );
}
