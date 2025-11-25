"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { updateMineStatusAction } from "@/actions/mine";

interface Props {
  open: boolean;
  onClose: () => void;
  mineId: string;
  currentState: boolean;
}

export function EnableDisableMineModal({
  open,
  onClose,
  mineId,
  currentState,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const result = await updateMineStatusAction(mineId, !currentState);

    setLoading(false);

    if (result?.success) {
      onClose();
      router.refresh();
    } else {
      alert(result?.message || "Failed to update mine status");
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {currentState ? "Disable Mine" : "Enable Mine"}
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to {currentState ? "disable" : "enable"} this
        mine?
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
