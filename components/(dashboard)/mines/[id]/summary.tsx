"use client";

import { Building2 } from "lucide-react";
import { IMine } from "@/definitions/mine";

export function MineSummary({ mine }: { mine: IMine }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <Building2 size={28} />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{mine.name}</h2>

          <p className="text-sm text-gray-500 mt-2">
            Created on{" "}
            {mine.createdAt
              ? new Date(mine.createdAt).toLocaleDateString("en-ZA")
              : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
