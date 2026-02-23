"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanyHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Transporters</h1>
      </div>
      <Button onClick={onAdd}>Add Transporter</Button>
    </div>
  );
}
