"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { IAction } from "@/definitions/action";
import { useState } from "react";
import ActionModal from "@/components/ui/modal";
import ActionAddForm from "./form";
import { DeleteActionModal } from "./delete-modal";

export function ActionCard({ action }: { action: IAction }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        className="bg-white border rounded-2xl p-4 shadow-sm flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-gray-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{action.name}</h3>
            <p className="text-xs text-gray-500">Resource: {action.resource}</p>
          </div>
        </div>

        <div className="flex justify-between">
          {action.description && (
            <p className="text-sm text-gray-600">{action.description}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* EDIT */}
      <ActionModal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <ActionAddForm action={action} onClose={() => setEditOpen(false)} />
      </ActionModal>

      {/* DELETE */}
      <ActionModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DeleteActionModal
          actionId={action.id!}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      </ActionModal>
    </>
  );
}
