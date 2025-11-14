"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
import { IOrder } from "@/definitions/order";

interface Props {
  order: IOrder;
  onBack: () => void;
}

export function OrderHeader({ order, onBack }: Props) {
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
