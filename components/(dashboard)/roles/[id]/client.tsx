"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IRole } from "@/definitions/role";
import { RoleHeader } from "./header";
import { RoleSummary } from "./summary";
import { RolePermissions } from "./permissions";
import RoleModal from "@/components/ui/modal";
import RoleAddForm from "../form";
import { DeleteRoleModal } from "../delete-modal";

export function RoleDetailsClient({ role }: { role: IRole }) {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <RoleHeader
          roleName={role.name}
          onBack={() => router.back()}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
        />

        <RoleSummary role={role} />

        <RolePermissions roleId={role.id!} />
      </motion.div>

      {/* EDIT */}
      <RoleModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <RoleAddForm
          role={role}
          onClose={() => {
            setIsEditOpen(false);
            router.refresh();
          }}
        />
      </RoleModal>

      {/* DELETE */}
      <DeleteRoleModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        roleId={role.id!}
      />
    </>
  );
}
