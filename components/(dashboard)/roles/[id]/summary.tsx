"use client";

import { Shield } from "lucide-react";
import { IRole } from "@/definitions/role";

export function RoleSummary({ role }: { role: IRole }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Shield size={28} />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{role.name}</h2>

          {role.description && (
            <p className="text-sm text-gray-600 mt-2">{role.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
