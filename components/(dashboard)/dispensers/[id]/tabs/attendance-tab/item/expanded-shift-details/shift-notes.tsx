"use client";

import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

interface ShiftNotesProps {
  record: IDispenserAttendanceRecord;
}

export function ShiftNotes({ record }: ShiftNotesProps) {
  if (!record.notes) return null;

  return (
    <div className="md:col-span-2">
      <p className="text-sm text-gray-600 bg-white p-2 rounded">
        <span className="font-medium">Notes:</span> {record.notes}
      </p>
    </div>
  );
}
