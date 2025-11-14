"use client";

import { Building2, PlusCircle } from "lucide-react";
import Link from "next/link";

export function CompanyHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-800">Companies</h1>
      </div>
    </div>
  );
}
