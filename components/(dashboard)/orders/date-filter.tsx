"use client";

import { CalendarDays } from "lucide-react";

export default function DateFilter({
  from,
  to,
  onChange,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-white shadow-sm border rounded-xl px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <label className="text-xs text-gray-500">From</label>
          </div>
          <input
            type="date"
            value={from}
            onChange={(e) => onChange(e.target.value, to)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
      </div>

      <span className="text-gray-400">—</span>

      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <label className="text-xs text-gray-500">To</label>
          </div>
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => onChange(from, e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
