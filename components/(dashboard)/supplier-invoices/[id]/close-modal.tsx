"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { closeSupplierInvoiceAction } from "@/actions/supplier-invoice";
import { Lock } from "lucide-react";

export function CloseSupplierInvoiceModal({
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

  const handleClose = () => {
    startTransition(async () => {
      const result = await closeSupplierInvoiceAction(invoiceId);

      if (result.success) {
        setMessage("✅ Invoice closed!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to close invoice.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-2">Close Invoice</h3>
      <p className="text-sm text-gray-600">
        Closing this invoice will lock it permanently.
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

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handleClose}
          disabled={isPending}
          className={`px-4 py-2 text-sm text-white rounded-md flex items-center gap-2 ${
            isPending ? "bg-gray-400" : "bg-gray-700 hover:bg-black transition"
          }`}
        >
          {isPending ? "Processing..." : "Close"}
          <Lock size={14} />
        </button>
      </div>
    </BaseModal>
  );
}
