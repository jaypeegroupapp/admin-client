"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function StaffHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Users className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Staff</h1>
      </div>
      <Button onClick={onAdd}>Add Staff</Button>
    </div>
  );
}
