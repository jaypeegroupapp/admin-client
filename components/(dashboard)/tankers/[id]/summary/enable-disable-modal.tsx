"use client";

import { useRouter } from "next/navigation";
import { toggleTankerPublishAction } from "@/actions/tanker";
import { BaseModal } from "@/components/ui/base-modal";
import { useState } from "react";

export function EnableDisableTankerModal({
  open,
  onClose,
  tankerId,
  currentState,
}: {
  open: boolean;
  onClose: () => void;
  tankerId: string;
  currentState: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const action = currentState ? "deactivate" : "activate";

  const handleToggle = async () => {
    setIsPending(true);
    await toggleTankerPublishAction(tankerId, !currentState);
    router.refresh();
    setIsPending(false);
    onClose();
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {currentState ? "Deactivate" : "Activate"} Tanker
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {action} this tanker?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition disabled:opacity-50 ${
              currentState
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPending
              ? "Processing..."
              : currentState
                ? "Deactivate"
                : "Activate"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
