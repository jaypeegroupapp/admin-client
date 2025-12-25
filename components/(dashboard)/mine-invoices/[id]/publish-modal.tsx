"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { publishCompanyMineInvoiceAction } from "@/actions/mine-invoice";
import { Check } from "lucide-react";

export function PublishInvoiceModal({
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

  const handleSubmit = () => {
    setMessage("");

    startTransition(async () => {
      const result = await publishCompanyMineInvoiceAction(invoiceId);

      if (result.success) {
        setMessage("✅ Invoice published successfully!");
        router.refresh();
        setTimeout(() => onClose(), 900);
      } else {
        setMessage(result.message || "❌ Failed to publish invoice.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Publish Invoice
      </h3>

      <p className="text-sm text-gray-600">
        This will publish the invoice and notify the company.
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
          className="px-4 py-2 text-sm border border-gray-300 rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
            isPending ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Publishing..." : "Publish"}
          <Check size={14} className="inline ml-1" />
        </button>
      </div>
    </BaseModal>
  );
}
