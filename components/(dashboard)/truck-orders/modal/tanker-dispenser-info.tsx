"use client";

import { Droplet, Fuel, Gauge, User, AlertCircle, Check } from "lucide-react";

export function TankerDispenserInfo({
  tankerName,
  tankerStock,
  totalDispensed,
  insufficientStock,
  hasAttendance,
  hasDispenser,
  canFulfill,
  attendance,
  dispenserName,
  quantity,
}: any) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-blue-50 p-3 border-b border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <Droplet size={16} />
          Tanker & Dispenser Information
        </h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Fuel size={12} /> Connected Tanker
            </p>
            <p className="font-medium text-gray-800 mt-1">{tankerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Gauge size={12} /> Tanker Stock
            </p>
            <p
              className={`font-bold text-xl mt-1 ${insufficientStock ? "text-red-600" : "text-green-600"}`}
            >
              {tankerStock.toFixed(2)}L
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Dispenser</p>
              <p className="font-medium text-gray-800 mt-1">
                {dispenserName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Meter Reading</p>
              <p className="font-medium text-blue-600 mt-1">
                {totalDispensed.toLocaleString()}L
              </p>
            </div>
          </div>
        </div>

        {hasAttendance ? (
          <div className="bg-green-50 p-3 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 p-1.5 rounded-full">
              <User size={14} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium">
                ✓ Active Shift
              </p>
              <p className="text-xs text-green-600">
                Started: {formatTime(attendance.loginTime)}
              </p>
              <p className="text-xs text-green-600">
                Opening Meter:{" "}
                {attendance.openingBalance?.toLocaleString() || 0}L
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-3 rounded-lg flex items-center gap-3">
            <AlertCircle size={16} className="text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">
                No Active Shift
              </p>
              <p className="text-xs text-yellow-600">
                Please start your shift before fulfilling orders
              </p>
            </div>
          </div>
        )}

        {insufficientStock && (
          <div className="bg-red-50 p-3 rounded-lg flex items-start gap-3">
            <AlertCircle size={16} className="text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                Insufficient Tanker Stock
              </p>
              <p className="text-xs text-red-600">
                Available: {tankerStock.toFixed(2)}L, Required: {quantity}L
              </p>
              <p className="text-xs text-red-600 mt-1">
                Please restock the tanker before fulfilling this order.
              </p>
            </div>
          </div>
        )}

        {canFulfill && (
          <div className="bg-green-100 p-3 rounded-lg flex items-center gap-3">
            <Check size={16} className="text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">
                Ready to Fulfill
              </p>
              <p className="text-xs text-green-600">
                All conditions met. Please collect signature below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
