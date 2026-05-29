"use client";

export function StatusPinCard({
  item,
  orderItemNumber,
}: {
  item: any;
  orderItemNumber: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500">Status</p>
        <span
          className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full capitalize ${
            item.status === "completed"
              ? "bg-green-100 text-green-700"
              : item.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : item.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.status}
        </span>
      </div>
      {item.status === "accepted" && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">PIN / Reference</p>
          <p className="font-mono font-bold text-sm mt-1">{orderItemNumber}</p>
        </div>
      )}
    </div>
  );
}
