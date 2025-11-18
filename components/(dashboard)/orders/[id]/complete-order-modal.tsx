"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeOrderAction } from "@/actions/order";
import { BaseModal } from "@/components/ui/base-modal";
import { Check } from "lucide-react";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

export function CompleteOrderModal({ orderId, open, onClose }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage("");

    startTransition(async () => {
      const result = await completeOrderAction(orderId);

      if (result.success) {
        setMessage("✅ Order completed successfully!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to complete order.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Complete Order
      </h3>

      <p className="text-sm text-gray-600">
        Once completed, this order will be locked and added to the company’s
        invoice.
      </p>

      {message && (
        <p
          className={`text-xs mt-3 ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Processing..." : "Complete"}
          <Check size={16} />
        </button>
      </div>
    </BaseModal>
  );
}
