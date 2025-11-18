"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { declineOrderAction } from "@/actions/order";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

export function DeclineOrderModal({ orderId, open, onClose }: Props) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      if (!reason) return setMessage("❌ Please enter a reason.");
      const result = await declineOrderAction(orderId, reason);

      if (result.success) {
        setMessage("✅ Order declined successfully!");
        router.refresh();
        setTimeout(() => onClose(), 800);
      } else {
        setMessage(result.message || "❌ Failed to decline order.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Decline Order
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block" htmlFor="reason">
            Reason for declining
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm text-gray-800 focus:ring-1 focus:ring-gray-700 focus:outline-none"
            rows={3}
          />
        </div>

        {message && (
          <p
            className={`text-xs ${
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

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Processing..." : "Decline"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
