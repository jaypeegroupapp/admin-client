"use client";

import { ArrowLeft } from "lucide-react";

interface Props {
  onBack: () => void;
}

export function CreditApprovalHeader({ onBack }: Props) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
  );
}
