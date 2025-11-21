"use client";

import { Button } from "@/components/ui/button";

export function MineHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800">Mines</h1>
      <Button onClick={onAdd}>Add Mine</Button>
    </div>
  );
}
