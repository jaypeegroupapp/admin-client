// components/(dashboard)/trucks/filter.tsx
"use client";
import { useState, useEffect } from "react";

export default function TruckFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    onFilterChange(text);
  }, [text]);
  return (
    <div className="flex items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search trucks by plate, make, model..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
      />
    </div>
  );
}
