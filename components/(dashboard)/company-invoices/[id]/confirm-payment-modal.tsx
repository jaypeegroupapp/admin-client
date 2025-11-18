"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { confirmCompanyInvoicePaymentAction } from "@/actions/company-invoice";
import { Check } from "lucide-react";

export function ConfirmPaymentModal({
  invoiceId,
  open,
  onClose,
}: {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    startTransition(async () => {
      const result = await confirmCompanyInvoicePaymentAction(invoiceId);

      if (result.success) {
        setMessage("✅ Payment confirmed!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to confirm payment.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-2">Confirm Payment</h3>
      <p className="text-sm text-gray-600">
        Are you sure you want to confirm payment for this invoice?
      </p>

      {message && (
        <p
          className={`text-xs mt-3 ${
            message.includes("✓") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handlePayment}
          disabled={isPending}
          className={`px-4 py-2 text-sm text-white rounded-md ${
            isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Processing..." : "Confirm"}
          <Check size={14} className="inline ml-1" />
        </button>
      </div>
    </BaseModal>
  );
}
