"use client";

import { IRole } from "@/definitions/role";
import { RoleCard } from "./card";

export function RoleList({ roles }: { roles: IRole[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </div>
  );
}
