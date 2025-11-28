"use client";

export default function OrderItemFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search by truck, company, product or status..."
      className="w-full border p-2 rounded-lg"
      onChange={(e) => onFilterChange(e.target.value)}
    />
  );
}
