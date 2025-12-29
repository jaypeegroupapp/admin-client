"use client";

import { Shield } from "lucide-react";

export function RoleHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Roles</h1>
      </div>
      <button
        onClick={onAdd}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm"
      >
        Add Role
      </button>
    </div>
  );
}
