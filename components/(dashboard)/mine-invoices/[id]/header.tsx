"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function InvoiceHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
  );
}
