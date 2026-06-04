"use client";

import { Factory } from "lucide-react";

export function CompanyCard({ item }: { item: any }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-300">
      <div className="bg-white p-2 rounded-lg">
        <Factory size={18} className="text-gray-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">Company</p>
        <p className="font-medium">{item.companyName || "N/A"}</p>
      </div>
    </div>
  );
}
