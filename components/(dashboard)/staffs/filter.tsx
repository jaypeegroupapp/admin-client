"use client";

import { Input } from "@/components/ui/input";

export default function MineFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  return (
    <div className="md:flex-auto w-full lg:w-auto flex items-center gap-3">
      <Input
        placeholder="Search mines..."
        onChange={(e) => onFilterChange(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
      />
    </div>
  );
}
