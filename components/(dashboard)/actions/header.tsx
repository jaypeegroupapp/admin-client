"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus } from "lucide-react";

export function ActionHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Actions</h1>
      </div>
      <Button onClick={onAdd}>
        <Plus className="w-6 h-6" /> Add Action
      </Button>
    </div>
  );
}
