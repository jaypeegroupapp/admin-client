"use client";

import { useState } from "react";
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";
import { AttendanceHistoryItem } from "./item";

interface AttendanceHistoryListProps {
  records: IDispenserAttendanceRecord[];
}

export function AttendanceHistoryList({ records }: AttendanceHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (records.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No attendance records found
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <AttendanceHistoryItem
          key={record.id}
          record={record}
          isExpanded={expandedId === record.id}
          onToggle={() =>
            setExpandedId(expandedId === record.id ? null : record.id!)
          }
        />
      ))}
    </div>
  );
}
