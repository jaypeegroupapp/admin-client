"use client";

export function InvoiceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    published: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    closed: "bg-gray-300 text-gray-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-md font-medium ${
        colors[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
