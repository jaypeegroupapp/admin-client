"use client";

export function RestockItemHeader({ record }: { record: any }) {
  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
        Discrepancy
      </span>
    );
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          <span className="text-gray-500">Before:</span>{" "}
          <span className="font-medium">{record.beforeStock}L</span>
        </span>
        <span className="text-sm">
          <span className="text-gray-500">Added:</span>{" "}
          <span className="font-medium text-green-600">
            +{record.quantityAdded}L
          </span>
        </span>
        <span className="text-sm">
          <span className="text-gray-500">After:</span>{" "}
          <span className="font-medium">{record.afterStock}L</span>
        </span>
      </div>
      {getStatusBadge(record.status)}
    </div>
  );
}
