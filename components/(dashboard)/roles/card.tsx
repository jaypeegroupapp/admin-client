"use client";

import { motion } from "framer-motion";
import { Shield, Pencil, Trash2 } from "lucide-react";
import { IRole } from "@/definitions/role";
import { useState } from "react";
import RoleModal from "@/components/ui/modal";
import RoleAddForm from "./form";
import { DeleteRoleModal } from "./delete-modal";

export function RoleCard({ role }: { role: IRole }) {
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
            <Shield className="text-gray-500" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">{role.name}</h3>
            <p className="text-xs text-gray-500">
              Role ID: {role.id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-start">
          {role.description && (
            <p className="text-sm text-gray-600">{role.description}</p>
          )}

          <div className="flex gap-2">
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
      <RoleModal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <RoleAddForm role={role} onClose={() => setEditOpen(false)} />
      </RoleModal>

      {/* DELETE */}
      <RoleModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DeleteRoleModal
          roleId={role.id!}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
        />
      </RoleModal>
    </>
  );
}
