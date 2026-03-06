// src/components/(dashboard)/dispensers/[id]/delete-modal.tsx
"use client";

import { useRouter } from "next/navigation";
import { deleteDispenserAction } from "@/actions/dispenser";
import { BaseModal } from "@/components/ui/base-modal";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DeleteDispenserModal({
  open,
  onClose,
  dispenserId,
}: {
  open: boolean;
  onClose: () => void;
  dispenserId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteDispenserAction(dispenserId);

    if (result.success) {
      router.push("/dispensers");
      router.refresh();
    } else {
      alert("Failed to delete dispenser: " + result.error);
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertTriangle size={24} />
          <h2 className="text-lg font-semibold">Delete Dispenser</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this dispenser? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
