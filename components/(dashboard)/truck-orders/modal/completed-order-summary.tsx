"use client";

export function CompletedOrderSummary({
  completedData,
}: {
  completedData: any;
}) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 print:bg-white print:border print:border-gray-300">
      <h3 className="font-semibold text-green-800 mb-3 text-lg">
        ✅ Order Completed
      </h3>
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <p>
            <span className="text-gray-600">Dispenser:</span>
          </p>
          <p className="font-medium">{completedData.dispenserName}</p>

          <p>
            <span className="text-gray-600">Litres Sold:</span>
          </p>
          <p className="font-medium text-blue-600">{completedData.quantity}L</p>

          <p>
            <span className="text-gray-600">Meter Reading:</span>
          </p>
          <p className="font-medium">
            {completedData.meterReading.toLocaleString()}L
          </p>

          <p>
            <span className="text-gray-600">Station Attendant:</span>
          </p>
          <p className="font-medium">{completedData.attendantName}</p>

          <p>
            <span className="text-gray-600">Shift Started:</span>
          </p>
          <p className="font-medium">
            {completedData.loginTime
              ? new Date(completedData.loginTime).toLocaleString()
              : "N/A"}
          </p>

          <p>
            <span className="text-gray-600">Opening Meter:</span>
          </p>
          <p className="font-medium">
            {completedData.openingBalance?.toLocaleString() || 0}L
          </p>

          <p>
            <span className="text-gray-600">Completed At:</span>
          </p>
          <p className="font-medium">
            {formatDateTime(completedData.completedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
