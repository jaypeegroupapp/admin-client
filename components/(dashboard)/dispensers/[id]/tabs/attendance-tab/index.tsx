"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import {
  getDispenserAttendanceRecords,
  getCurrentAttendance,
} from "@/data/dispenser-attendance";
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";
import { CurrentAttendanceCard } from "./current-attendance-card";
import { EmptyAttendanceState } from "./empty-attendance-state";
import { AttendanceHistoryList } from "./list";
import { AssignAttendantModal } from "./assign-attendant-modal";
import { RemoveAttendantModal } from "./remove-attendant-modal";

interface AttendanceTabProps {
  dispenserId: string;
  totalDispensed: number;
}

export function AttendanceTab({
  dispenserId,
  totalDispensed,
}: AttendanceTabProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    IDispenserAttendanceRecord[]
  >([]);
  const [currentAttendance, setCurrentAttendance] =
    useState<IDispenserAttendanceRecord | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [records, current] = await Promise.all([
      getDispenserAttendanceRecords(dispenserId),
      getCurrentAttendance(dispenserId),
    ]);
    setAttendanceRecords(records);
    setCurrentAttendance(current);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [dispenserId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Attendance Section */}
      {currentAttendance ? (
        <CurrentAttendanceCard
          attendance={currentAttendance}
          onEndShift={() => setShowRemoveModal(true)}
        />
      ) : (
        <EmptyAttendanceState onAssign={() => setShowAssignModal(true)} />
      )}

      {/* Attendance History */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-500" />
          Attendance History
        </h3>
        <AttendanceHistoryList records={attendanceRecords} />
      </div>

      {/* Modals */}
      <AssignAttendantModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        dispenserId={dispenserId}
        currentMeterReading={totalDispensed}
        onSuccess={loadData}
      />

      {currentAttendance && (
        <RemoveAttendantModal
          open={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          attendanceRecord={currentAttendance}
          currentMeterReading={totalDispensed}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
