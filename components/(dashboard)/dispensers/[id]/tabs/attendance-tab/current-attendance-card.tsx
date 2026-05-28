"use client";

import { Users, UserMinus, Clock } from "lucide-react";
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

interface CurrentAttendanceCardProps {
  attendance: IDispenserAttendanceRecord;
  onEndShift: () => void;
}

export function CurrentAttendanceCard({
  attendance,
  onEndShift,
}: CurrentAttendanceCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          <h3 className="font-medium text-blue-800">Current Shift</h3>
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <Clock size={12} /> Active
          </span>
        </div>
        <button
          onClick={onEndShift}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          <UserMinus size={16} />
          End Shift
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        <div>
          <p className="text-xs text-blue-600">Attendant</p>
          <p className="font-medium text-blue-900">
            {attendance.attendantName}
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-600">Login Time</p>
          <p className="font-medium text-blue-900">
            {new Date(attendance.loginTime).toLocaleTimeString("en-ZA")}
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-600">Opening Meter</p>
          <p className="font-medium text-blue-900">
            {attendance.openingBalanceLitres.toLocaleString()}L
          </p>
        </div>
        <div>
          <p className="text-xs text-blue-600">Total Dispensed</p>
          <p className="font-medium text-blue-900">
            {(attendance.totalDispensed || 0).toLocaleString()}L
          </p>
        </div>
      </div>
    </div>
  );
}
