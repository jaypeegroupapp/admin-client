"use client";

import { Search } from "lucide-react";

interface DispenserSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function DispenserSearch({
  searchTerm,
  onSearchChange,
}: DispenserSearchProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder="Search dispensers..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
