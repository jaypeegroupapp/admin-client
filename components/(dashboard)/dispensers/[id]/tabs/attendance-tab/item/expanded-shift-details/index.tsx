"use client";

import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";
import { ShiftDetails } from "./shift-details";
import { BalanceCalculation } from "./balance-calculation";
import { ShiftNotes } from "./shift-notes";

interface ExpandedShiftDetailsProps {
  record: IDispenserAttendanceRecord;
}

export function ExpandedShiftDetails({ record }: ExpandedShiftDetailsProps) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShiftDetails record={record} />
        <BalanceCalculation record={record} />
        <ShiftNotes record={record} />
      </div>
    </div>
  );
}
