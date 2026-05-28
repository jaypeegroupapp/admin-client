"use client";

interface AttendanceTabProps {
  dispenserId: string;
}

export function AttendanceTab({ dispenserId }: AttendanceTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Attendance management will be implemented here.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-400">
        Features coming soon:
        <ul className="mt-2 text-xs">
          <li>• Assign attendant to dispenser</li>
          <li>• Shift start with opening meter reading</li>
          <li>• Shift end with closing meter reading</li>
          <li>• Shift reconciliation and variance tracking</li>
          <li>• Historical shift records</li>
        </ul>
      </div>
    </div>
  );
}
