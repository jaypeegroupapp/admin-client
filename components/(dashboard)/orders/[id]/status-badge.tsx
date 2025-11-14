"use client";

export function OrderStatusBadge({ status }: { status: string }) {
  const styles =
    {
      pending: "bg-gray-100 text-gray-700",
      completed: "bg-gray-200 text-gray-800",
      cancelled: "bg-gray-50 text-gray-600",
    }[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status.toUpperCase()}
    </span>
  );
}
