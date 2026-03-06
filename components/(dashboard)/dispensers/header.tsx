// src/components/(dashboard)/dispensers/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";

export function DispenserHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Droplet className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Dispensers</h1>
      </div>
      <Button onClick={onAdd}>Add Dispenser</Button>
    </div>
  );
}
