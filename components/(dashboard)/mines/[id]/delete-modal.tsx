"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BaseModal } from "@/components/ui/base-modal";
import { deleteMineAction } from "@/actions/mine";

interface Props {
  open: boolean;
  onClose: () => void;
  mineId: string;
}

export function DeleteMineModal({ open, onClose, mineId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteMineAction(mineId);

    setLoading(false);

    if (result?.success) {
      onClose();
      router.push("/mines");
    } else {
      alert(result?.message || "Failed to delete mine");
    }
  };

  return (
    <BaseModal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Mine</h3>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this mine? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </BaseModal>
  );
}
