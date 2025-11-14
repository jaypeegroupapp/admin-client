"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function OrderHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
      <Link
        href="/orders/add"
        className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <PlusCircle size={18} />
        Add Order
      </Link>
    </div>
  );
}
