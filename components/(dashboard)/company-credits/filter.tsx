"use client";

export default function CompanyCreditFilter({
  onFilterChange,
  initialValue = "",
}: {
  onFilterChange: (text: string) => void;
  initialValue?: string;
}) {
  return (
    <div className="md:flex-auto w-full lg:w-auto flex items-center gap-3">
      <input
        type="text"
        defaultValue={initialValue}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search company or mine..."
        className="flex-1 rounded-md border px-3 py-2 text-sm"
      />
    </div>
  );
}
