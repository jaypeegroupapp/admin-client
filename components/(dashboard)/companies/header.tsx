"use client";

import { Building2 } from "lucide-react";

export function CompanyHeader() {
  return (
    <div className="flex items-center gap-2">
      <Building2 className="w-6 h-6 text-gray-700" />
      <h1 className="text-xl font-semibold text-gray-800">Companies</h1>
    </div>
  );
}
