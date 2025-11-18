"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { acceptOrderAction } from "@/actions/order";
import { Check } from "lucide-react";

interface Props {
  orderId: string;
  totalStockToDeduct: number;
  open: boolean;
  onClose: () => void;
}

export function AcceptOrderModal({
  orderId,
  totalStockToDeduct,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage("");

    startTransition(async () => {
      const result = await acceptOrderAction(orderId, totalStockToDeduct);

      if (result.success) {
        setMessage("✅ Order accepted successfully!");
        router.refresh();
        setTimeout(() => onClose(), 800);
      } else {
        setMessage(result.message || "❌ Failed to accept order.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Accept Order</h3>

      <p className="text-sm text-gray-600">
        Are you sure you want to accept this order?
      </p>

      {message && (
        <p
          className={`text-xs mt-3 ${
            message.includes("✅")
              ? "text-green-600"
              : message.includes("❌")
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`flex items-center justify-between px-4 py-2 gap-2 text-sm font-medium text-white rounded-md ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Processing..." : "Accept"}
          <Check size={16} className="ml-1" />
        </button>
      </div>
    </BaseModal>
  );
}
