"use client";

import { useState, useTransition } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import {
  confirmInvoiceDebitPaymentAction,
  confirmInvoicePaymentAction,
} from "@/actions/company-invoice";
import { Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  invoiceId: string;
  invoiceBalance: number;
  debitAmount: number;
  open: boolean;
  onClose: () => void;
}

export function PayWithDebitModal({
  invoiceId,
  invoiceBalance,
  debitAmount,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setMessage("");

    startTransition(async () => {
      const result = await confirmInvoiceDebitPaymentAction(invoiceId);

      if (result.success === false) {
        setMessage("Failed to confirm payment");
        setTimeout(onClose, 800);
        return;
      }

      setMessage("✅ Invoice settled using debit");
      router.refresh();
      setTimeout(onClose, 800);
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Settle Invoice with Debit
      </h3>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700 space-y-2">
        <div className="flex gap-2 items-start">
          <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
          <p>
            This action will settle the invoice using the company’s available
            debit balance.
          </p>
        </div>

        <p>
          <strong>Invoice Balance:</strong> R{invoiceBalance.toFixed(2)}
        </p>
        <p>
          <strong>Available Debit:</strong> R{debitAmount.toFixed(2)}
        </p>
      </div>

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
          onClick={handleConfirm}
          disabled={isPending}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isPending ? "Processing..." : "Confirm Debit Payment"}
          <Check size={16} />
        </button>
      </div>
    </BaseModal>
  );
}
