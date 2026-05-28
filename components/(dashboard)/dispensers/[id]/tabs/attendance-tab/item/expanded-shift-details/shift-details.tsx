"use client";

import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

interface ShiftDetailsProps {
  record: IDispenserAttendanceRecord;
}

export function ShiftDetails({ record }: ShiftDetailsProps) {
  const getDuration = () => {
    if (!record.logoutTime) return "Active";
    const diff =
      new Date(record.logoutTime).getTime() -
      new Date(record.loginTime).getTime();
    const hours = Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
    return `${hours} hours`;
  };

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">Shift Details</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Login Time:</span>
          <span className="font-medium">
            {new Date(record.loginTime).toLocaleString("en-ZA")}
          </span>
        </div>
        {record.logoutTime && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Logout Time:</span>
            <span className="font-medium">
              {new Date(record.logoutTime).toLocaleString("en-ZA")}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium">{getDuration()}</span>
        </div>
      </div>
    </div>
  );
}
