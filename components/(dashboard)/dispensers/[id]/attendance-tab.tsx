// src/components/(dashboard)/dispensers/[id]/attendance-tab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  UserMinus,
  Users,
  Calendar,
  Droplet,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import {
  getDispenserAttendanceRecords,
  getCurrentAttendance,
} from "@/data/dispenser-attendance";
import { AssignAttendantModal } from "./assign-attendant-modal";
import { RemoveAttendantModal } from "./remove-attendant-modal";
import { IDispenserAttendanceRecord } from "@/definitions/dispenser-attendance";

export function AttendanceTab({
  dispenserId,
  dispenserLitres,
}: {
  dispenserId: string;
  dispenserLitres: number;
}) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    IDispenserAttendanceRecord[]
  >([]);
  const [currentAttendance, setCurrentAttendance] =
    useState<IDispenserAttendanceRecord | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <Clock size={12} /> Active
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            Completed
          </span>
        );
      case "reconciled":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            Reconciled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getVarianceBadge = (variance: number) => {
    if (Math.abs(variance) < 0.1) {
      return (
        <span className="text-green-600 text-xs font-medium">✓ Exact</span>
      );
    } else if (Math.abs(variance) < 15) {
      return (
        <span className="text-yellow-600 text-xs font-medium">
          ⚠ Small variance
        </span>
      );
    } else {
      return (
        <span className="text-red-600 text-xs font-medium">
          ❗ Large variance
        </span>
      );
    }
  };

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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              <h3 className="font-medium text-blue-800">Current Attendance</h3>
              {getStatusBadge(currentAttendance.status)}
            </div>
            <button
              onClick={() => setShowRemoveModal(true)}
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
                {currentAttendance.attendantName}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600">Login Time</p>
              <p className="font-medium text-blue-900">
                {new Date(currentAttendance.loginTime).toLocaleTimeString(
                  "en-ZA",
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600">Opening Balance</p>
              <p className="font-medium text-blue-900">
                {currentAttendance.openingBalanceLitres.toFixed(2)}L
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-600">Total Sold</p>
              <p className="font-medium text-blue-900">
                {currentAttendance.totalDispensed || 0}L
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Users size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-3">No attendant currently assigned</p>
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <UserPlus size={16} />
            Assign Attendant
          </button>
        </div>
      )}

      {/* Attendance History */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-500" />
          Attendance History
        </h3>

        {attendanceRecords.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No attendance records found
          </p>
        ) : (
          <div className="space-y-3">
            {attendanceRecords.map((record) => {
              const variancePercent =
                record.variance !== undefined &&
                record.expectedClosing &&
                record.expectedClosing > 0
                  ? (record.variance / record.expectedClosing) * 100
                  : 0;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Record Header */}
                  <div
                    className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() =>
                      setExpandedRecord(
                        expandedRecord === record.id ? null : record.id!,
                      )
                    }
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(record.loginTime).toLocaleDateString(
                              "en-ZA",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserPlus size={14} className="text-gray-400" />
                          <span className="text-sm font-medium">
                            {record.attendantName || "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Droplet size={14} className="text-gray-400" />
                          <span className="text-sm">
                            <span className="text-gray-500">Sold:</span>{" "}
                            <span className="font-medium">
                              {record.totalDispensed || 0}L
                            </span>
                          </span>
                        </div>

                        {record.variance !== undefined && (
                          <div className="flex items-center gap-1">
                            {getVarianceBadge(variancePercent)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(record.status)}
                      {expandedRecord === record.id ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRecord === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shift Details */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">
                            Shift Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Login Time:</span>
                              <span className="font-medium">
                                {new Date(record.loginTime).toLocaleString(
                                  "en-ZA",
                                )}
                              </span>
                            </div>
                            {record.logoutTime && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Logout Time:
                                </span>
                                <span className="font-medium">
                                  {new Date(record.logoutTime).toLocaleString(
                                    "en-ZA",
                                  )}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">
                                {record.logoutTime
                                  ? Math.round(
                                      ((new Date(record.logoutTime).getTime() -
                                        new Date(record.loginTime).getTime()) /
                                        (1000 * 60 * 60)) *
                                        10,
                                    ) /
                                      10 +
                                    " hours"
                                  : "Active"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Balance Calculations */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">
                            Balance Calculations
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Opening Balance:
                              </span>
                              <span className="font-medium">
                                {record.openingBalanceLitres.toFixed(2)}L
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Sold:</span>
                              <span className="font-medium text-red-600">
                                -{record.totalDispensed || 0}L
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-gray-200 pt-1">
                              <span className="text-gray-600">
                                Expected Closing:
                              </span>
                              <span className="font-medium">
                                {(
                                  record.openingBalanceLitres -
                                  (record.totalDispensed || 0)
                                ).toFixed(1)}
                                L
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Actual Closing:
                              </span>
                              <span className="font-medium">
                                {record.closingBalanceLitres?.toFixed(2) || "—"}L
                              </span>
                            </div>
                            {record.closingBalanceLitres && (
                              <div
                                className={`flex justify-between text-sm font-medium p-2 rounded mt-1 ${
                                  Math.abs(record.variance || 0) < 0.1
                                    ? "bg-green-100 text-green-700"
                                    : Math.abs(record.variance || 0) < 1
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                <span>Variance:</span>
                                <span>
                                  {(record.variance || 0) > 0 ? "+" : ""}
                                  {(record.variance || 0).toFixed(2)}L
                                  <span className="text-xs ml-1">
                                    (
                                    {(
                                      ((record.variance || 0) /
                                        record.openingBalanceLitres) *
                                      100
                                    ).toFixed(1)}
                                    %)
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {record.notes && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600 bg-white p-2 rounded">
                              <span className="font-medium">Notes:</span>{" "}
                              {record.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AssignAttendantModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        dispenserId={dispenserId}
        currentBalance={dispenserLitres}
        onSuccess={loadData}
      />

      {currentAttendance && (
        <RemoveAttendantModal
          open={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          attendanceRecord={currentAttendance}
          dispenserId={dispenserId}
          currentBalance={dispenserLitres}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
