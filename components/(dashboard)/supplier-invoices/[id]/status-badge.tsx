"use client";

export function SupplierInvoiceStatusBadge({ status }: { status: string }) {
  const colors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
