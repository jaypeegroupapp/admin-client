"use client";

import { deleteActionAction } from "@/actions/action";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteActionModal({
  actionId,
  open,
  onClose,
}: {
  actionId: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  const handleDelete = async () => {
    await deleteActionAction(actionId);
    router.replace("/actions");
    // onClose();
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 w-[360px]">
      <div className="flex items-center gap-2 mb-4 text-red-600">
        <Trash2 size={20} />
        <h2 className="font-semibold">Delete Action</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this action? This cannot be undone and
        may break role permissions.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-lg border"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
