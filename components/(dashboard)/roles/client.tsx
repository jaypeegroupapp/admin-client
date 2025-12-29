"use client";

import { useEffect, useState } from "react";
import { IRole } from "@/definitions/role";
import RoleModal from "@/components/ui/modal";
import RoleAddForm from "./form";
import { RoleList } from "./list";
import { RoleHeader } from "./header";

export function RolesClientPage({ initialRoles }: { initialRoles: IRole[] }) {
  const [roles, setRoles] = useState<IRole[]>(initialRoles);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRoles(initialRoles);
  }, [initialRoles]);

  return (
    <div className="space-y-6">
      <RoleHeader onAdd={() => setOpen(true)} />

      <RoleList roles={roles} />

      <RoleModal isOpen={open} onClose={() => setOpen(false)}>
        <RoleAddForm onClose={() => setOpen(false)} />
      </RoleModal>
    </div>
  );
}
