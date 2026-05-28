"use client";

import { Users, UserPlus } from "lucide-react";

interface EmptyAttendanceStateProps {
  onAssign: () => void;
}

export function EmptyAttendanceState({ onAssign }: EmptyAttendanceStateProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
      <Users size={32} className="mx-auto text-gray-400 mb-2" />
      <p className="text-gray-600 mb-3">No attendant currently assigned</p>
      <button
        onClick={onAssign}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <UserPlus size={16} />
        Start Shift
      </button>
    </div>
  );
}
