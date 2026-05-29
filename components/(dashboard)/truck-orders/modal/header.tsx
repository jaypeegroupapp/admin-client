"use client";

import { X } from "lucide-react";

export function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-3 print:border-gray-300">
      <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 print:hidden"
      >
        <X size={20} />
      </button>
    </div>
  );
}
