"use client";

import { Button } from "@/components/ui/button";
import { Fuel } from "lucide-react";

export function TankerHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Fuel className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Tankers</h1>
      </div>
      <Button onClick={onAdd}>Add Tanker</Button>
    </div>
  );
}
