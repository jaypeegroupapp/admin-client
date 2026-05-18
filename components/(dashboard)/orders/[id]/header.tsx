// src/components/(dashboard)/orders/[id]/header.tsx
"use client";

import { ArrowLeft, Printer, Download } from "lucide-react";

export function OrderHeader({
  order,
  onBack,
}: {
  order: any;
  onBack: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl font-semibold text-gray-800">Order Details</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrint}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          title="Print Order"
        >
          <Printer size={18} />
        </button>
        <button
          onClick={handlePrint}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          title="Download PDF"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
