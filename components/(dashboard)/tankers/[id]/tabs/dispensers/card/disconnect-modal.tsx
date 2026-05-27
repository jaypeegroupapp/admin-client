"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { AlertTriangle } from "lucide-react";
import { disconnectDispenserFromTankerAction } from "@/actions/tanker-dispenser";

interface DisconnectDispenserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tankerId: string;
  dispenserId: string;
  dispenserName: string;
}

export function DisconnectDispenserModal({
  open,
  onClose,
  onSuccess,
  tankerId,
  dispenserId,
  dispenserName,
}: DisconnectDispenserModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDisconnect = async () => {
    setIsPending(true);
    const result = await disconnectDispenserFromTankerAction(
      tankerId,
      dispenserId,
    );
    if (result.success) {
      router.refresh();
      // Close disconnect modal first
      onClose();
      // Then trigger parent refresh after a short delay to ensure modal is closed
      setTimeout(() => {
        onSuccess?.();
      }, 100);
    }
    setIsPending(false);
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-lg font-semibold">Disconnect Dispenser</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to disconnect <strong>{dispenserName}</strong>{" "}
          from this tanker? This action can be reversed by reconnecting later.
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
            onClick={handleDisconnect}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
          >
            {isPending ? "Disconnecting..." : "Disconnect"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
