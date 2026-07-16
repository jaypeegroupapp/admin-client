"use client";

import { ClipboardList } from "lucide-react";

export function WaitingListHeader() {
  return (
    <div className="flex items-center gap-2">
      <ClipboardList className="w-6 h-6 text-gray-700" />
      <h1 className="text-xl font-semibold text-gray-800">Waiting List</h1>
    </div>
  );
}
