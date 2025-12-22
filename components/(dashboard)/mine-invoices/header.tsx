"use client";

import { FileText } from "lucide-react";

export function MineInvoiceHeader() {
  return (
    <div className="flex items-center gap-2">
      <FileText className="w-6 h-6 text-gray-700" />
      <h1 className="text-xl font-semibold text-gray-800">Mine Invoices</h1>
    </div>
  );
}
