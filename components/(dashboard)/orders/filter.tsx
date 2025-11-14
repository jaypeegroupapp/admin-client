"use client";

export default function OrderFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <input
        type="text"
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search orders..."
        className="flex-1 rounded-md border px-3 py-2"
      />
    </div>
  );
}
