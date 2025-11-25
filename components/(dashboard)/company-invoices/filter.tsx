"use client";

export default function CompanyInvoiceFilter({
  onFilterChange,
}: {
  onFilterChange: (text: string) => void;
}) {
  return (
    <div className="md:flex-auto w-full lg:w-auto flex items-center gap-3">
      <input
        type="text"
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search invoices..."
        className="flex-1 rounded-md border px-3 py-2"
      />
    </div>
  );
}
