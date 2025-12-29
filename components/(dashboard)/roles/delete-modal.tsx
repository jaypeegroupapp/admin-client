"use client";

import { deleteRoleAction } from "@/actions/role";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteRoleModal({
  roleId,
  open,
  onClose,
}: {
  roleId: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  const handleDelete = async () => {
    await deleteRoleAction(roleId);
    router.replace("/roles");
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 w-[360px]">
      <div className="flex items-center gap-2 mb-4 text-red-600">
        <Trash2 size={20} />
        <h2 className="font-semibold">Delete Role</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this role? This may affect users and
        permissions linked to it.
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
