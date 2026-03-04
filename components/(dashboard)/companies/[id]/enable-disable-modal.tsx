"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { updateCompanyCreditStatusAction } from "@/actions/company-credit";

interface Props {
  open: boolean;
  onClose: () => void;
  creditId: string;
  companyId: string;
  currentState: boolean;
}

export function EnableDisableCompanyCreditModal({
  open,
  onClose,
  creditId,
  companyId,
  currentState,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const result = await updateCompanyCreditStatusAction(
      creditId,
      companyId,
      !currentState,
    );

    setLoading(false);

    if (result?.success) {
      onClose();
      router.refresh();
    } else {
      alert(result?.message || "Failed to update credit status");
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {currentState ? "Disable Credit Facility" : "Enable Credit Facility"}
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to {currentState ? "disable" : "enable"} this
        credit facility?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`px-4 py-2 text-sm rounded-lg text-white transition disabled:opacity-50
            ${
              currentState
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {loading ? "Updating..." : currentState ? "Disable" : "Enable"}
        </button>
      </div>
    </BaseModal>
  );
}
