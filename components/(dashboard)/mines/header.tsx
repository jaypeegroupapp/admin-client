"use client";

import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";

export function MineHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Mountain className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Mines</h1>
      </div>{" "}
      <Button onClick={onAdd}>Add Mine</Button>
    </div>
  );
}
