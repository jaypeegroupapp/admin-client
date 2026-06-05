"use client";

import {
  Droplet,
  Fuel,
  Gauge,
  User,
  AlertCircle,
  Check,
  UserX,
} from "lucide-react";

export function TankerDispenserInfo({
  tankerName,
  tankerStock,
  totalDispensed,
  insufficientStock,
  hasAttendance,
  hasDispenser,
  hasTanker,
  canFulfill,
  noDispenser,
  noAttendance,
  noTanker,
  attendance,
  dispenserName,
  attendantName,
  quantity,
}: any) {
  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // No dispenser assigned
  if (noDispenser) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-50 p-3 border-b border-red-100">
          <h3 className="text-sm font-medium text-red-800 flex items-center gap-2">
            <Droplet size={16} />
            Dispenser Information
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <UserX size={20} className="text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">
                No Dispenser Assigned
              </p>
              <p className="text-xs text-red-600 mt-1">
                You don't have a dispenser assigned. Please contact your
                manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No active shift
  if (noAttendance) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-yellow-50 p-3 border-b border-yellow-100">
          <h3 className="text-sm font-medium text-yellow-800 flex items-center gap-2">
            <Droplet size={16} />
            Dispenser Information
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-yellow-700">
                No Active Shift
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                You are assigned to <strong>{dispenserName}</strong> but not
                logged in. Please start your shift before fulfilling orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No tanker connected
  if (noTanker) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-orange-50 p-3 border-b border-orange-100">
          <h3 className="text-sm font-medium text-orange-800 flex items-center gap-2">
            <Droplet size={16} />
            Tanker Information
          </h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Fuel size={20} className="text-orange-500" />
            <div>
              <p className="text-sm font-medium text-orange-700">
                No Tanker Connected
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Dispenser <strong>{dispenserName}</strong> has no tanker
                connected. Please contact your manager.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal display with tanker info
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden print:border-gray-300">
      <div className="bg-blue-50 p-3 border-b border-blue-100 print:bg-gray-100 print:border-gray-300">
        <h3 className="text-sm font-medium text-blue-800 print:text-gray-800 flex items-center gap-2">
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
              className={`font-bold text-xl mt-1 ${insufficientStock ? "text-red-600" : "text-green-600"} print:text-gray-800`}
            >
              {tankerStock.toFixed(2)}L
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 print:border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Dispenser</p>
              <p className="font-medium text-gray-800 mt-1">
                {dispenserName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Meter Reading</p>
              <p className="font-medium text-blue-600 print:text-gray-800 mt-1">
                {totalDispensed.toLocaleString()}L
              </p>
            </div>
          </div>
        </div>

        {/* Active Shift Info */}
        {hasAttendance && (
          <div className="bg-green-50 p-3 rounded-lg flex items-center gap-3 print:bg-white print:border print:border-gray-300">
            <div className="bg-green-100 p-1.5 rounded-full print:bg-gray-100">
              <User size={14} className="text-green-600 print:text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium print:text-gray-700">
                ✓ Active Shift
              </p>
              <p className="text-xs text-green-600 print:text-gray-600">
                Attendant: {attendantName || "Unknown"}
              </p>
              <p className="text-xs text-green-600 print:text-gray-600">
                Started: {formatTime(attendance?.loginTime)}
              </p>
              <p className="text-xs text-green-600 print:text-gray-600">
                Opening Meter:{" "}
                {attendance?.openingBalance?.toLocaleString() || 0}L
              </p>
            </div>
          </div>
        )}

        {/* Insufficient Stock Warning */}
        {insufficientStock && (
          <div className="bg-red-50 p-3 rounded-lg flex items-start gap-3 print:bg-white print:border print:border-gray-300">
            <AlertCircle
              size={16}
              className="text-red-600 mt-0.5 print:text-gray-600"
            />
            <div>
              <p className="text-sm text-red-700 font-medium print:text-gray-700">
                Insufficient Tanker Stock
              </p>
              <p className="text-xs text-red-600 print:text-gray-600">
                Available: {tankerStock.toFixed(2)}L, Required: {quantity}L
              </p>
            </div>
          </div>
        )}

        {/* Ready to Fulfill Indicator */}
        {canFulfill && (
          <div className="bg-green-100 p-3 rounded-lg flex items-center gap-3 print:bg-white print:border print:border-gray-300">
            <Check size={16} className="text-green-600 print:text-gray-600" />
            <div>
              <p className="text-sm text-green-700 font-medium print:text-gray-700">
                Ready to Fulfill
              </p>
              <p className="text-xs text-green-600 print:text-gray-600">
                All conditions met. Please collect signature below.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
