"use client";

import { useTransition, useState } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { approveCompanyCreditApprovalAction } from "@/actions/company-credit-approval";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function ApproveCreditModal({ approvalId, open, onClose }: any) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setMessage("");

    startTransition(async () => {
      const result = await approveCompanyCreditApprovalAction(approvalId);

      if (result.success) {
        setMessage("✅ Approval accepted successfully!");
        router.refresh();
        setTimeout(() => onClose(), 800);
      } else {
        setMessage(result.message || "❌ Failed to approve.");
      }
    });
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Approve Credit Request
      </h3>

      <p className="text-sm text-gray-600">
        Are you sure you want to approve this credit request?
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
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className={`flex items-center px-4 py-2 gap-2 text-sm font-medium text-white rounded-md ${
            isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "Processing..." : "Approve"}
          <Check size={16} />
        </button>
      </div>
    </BaseModal>
  );
}
