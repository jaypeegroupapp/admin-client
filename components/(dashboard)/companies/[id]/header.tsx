"use client";

import { ArrowLeft } from "lucide-react";

export function CompanyHeader({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
    </div>
  );
}
