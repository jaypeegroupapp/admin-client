"use client";

import { Input } from "@/components/ui/input";

export default function ProductFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Search products..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full sm:w-64"
      />
    </div>
  );
}
