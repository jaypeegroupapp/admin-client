"use client";

import { Printer } from "lucide-react";

export function ActionButtons({
  onClose,
  onPrint,
}: {
  onClose: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 print:border-gray-300">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition print:hidden"
      >
        Close
      </button>
      <button
        onClick={onPrint}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition print:hidden"
      >
        <Printer size={16} />
        Print Receipt
      </button>
    </div>
  );
}
