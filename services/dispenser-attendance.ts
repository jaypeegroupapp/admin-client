// src/services/dispenser-attendance.ts
import { connectDB } from "@/lib/db";
import mongoose, { Types } from "mongoose";
import DispenserAttendanceRecord from "@/models/dispenser-attendance";
import Dispenser from "@/models/dispenser";
import Staff from "@/models/staff";

export async function getCurrentAttendanceService(dispenserId: string) {
  await connectDB();

  return await DispenserAttendanceRecord.findOne({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
    status: "active",
  })
    .populate("attendantId", "name email")
    .lean();
}

export async function assignAttendantService(input: {
  dispenserId: string;
  userId: string;
  attendantId: string;
  openingBalance: number;
  notes?: string;
}) {
  await connectDB();

  const { dispenserId, userId, attendantId, openingBalance, notes } = input;

  // Create attendance record
  const attendanceRecord = await DispenserAttendanceRecord.create({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
    userId: new mongoose.Types.ObjectId(userId),
    attendantId: new mongoose.Types.ObjectId(attendantId),
    openingBalanceLitres: openingBalance,
    loginTime: new Date(),
    status: "active",
    notes,
  });

  // Update dispenser with assigned user
  await Dispenser.findByIdAndUpdate(dispenserId, {
    userId: new mongoose.Types.ObjectId(userId),
    lastReading: openingBalance,
    lastReadingDate: new Date(),
  });

  return attendanceRecord;
}

export async function removeAttendantService(input: {
  attendanceRecordId: string;
  closingBalance: number;
  notes?: string;
}) {
  await connectDB();

  const { attendanceRecordId, closingBalance, notes } = input;

  // Get attendance record
  const attendanceRecord =
    await DispenserAttendanceRecord.findById(attendanceRecordId);
  if (!attendanceRecord) throw new Error("Attendance record not found");

  // Get all transactions for this shift to calculate total sold
  const transactions = await DispenserAttendanceRecord.find({
    attendanceRecordId: new mongoose.Types.ObjectId(attendanceRecordId),
    type: "SALE",
  });

  const totalSold = transactions.reduce(
    (sum, t) => sum + Math.abs(t.quantity),
    0,
  );

  // Calculate variance
  const expectedClosing = attendanceRecord.openingBalanceLitres - totalSold;
  const variance = closingBalance - expectedClosing;

  // Update attendance record
  attendanceRecord.closingBalanceLitres = closingBalance;
  attendanceRecord.totalDispensed = totalSold;
  attendanceRecord.expectedClosing = expectedClosing;
  attendanceRecord.variance = variance;
  attendanceRecord.logoutTime = new Date();
  attendanceRecord.status =
    variance && Math.abs(variance) > 0.1 ? "completed" : "completed";
  attendanceRecord.notes = notes
    ? attendanceRecord.notes + " | " + notes
    : attendanceRecord.notes;
  await attendanceRecord.save();

  // Unassign dispenser
  await Dispenser.findByIdAndUpdate(attendanceRecord.dispenserId, {
    userId: null,
    litres: closingBalance,
    lastReading: closingBalance,
    lastReadingDate: new Date(),
  });

  return {
    ...attendanceRecord.toObject(),
    dispenserId: attendanceRecord.dispenserId.toString(),
  };
}

export async function getDispenserAttendanceRecordsService(
  dispenserId: string,
  limit?: number,
) {
  await connectDB();

  let query = DispenserAttendanceRecord.find({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  })
    .populate("attendantId", "name email")
    .sort({ loginTime: -1 });

  if (limit) {
    query = query.limit(limit);
  }

  return await query.lean();
}

// Get staff who are NOT currently assigned to any active dispenser
export async function getAvailableAttendantsService() {
  await connectDB();

  // Get all active staff
  const activeStaff = await Staff.find({ status: "active" })
    .populate("userId", "name email")
    .lean();

  if (!activeStaff.length) return [];

  // Get all active dispenser assignments
  const activeAssignments = await Dispenser.find({
    userId: { $exists: true, $ne: null },
  })
    .select("userId")
    .lean();

  // Get IDs of users who are already assigned
  const assignedUserIds = activeAssignments
    .map((a) => a.userId?.toString())
    .filter(Boolean);

  // Filter out staff whose userId is already assigned
  const availableStaff = activeStaff.filter((staff: any) => {
    const userId = staff.userId?._id?.toString() || staff.userId?.toString();
    return userId && !assignedUserIds.includes(userId);
  });

  return availableStaff.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    status: s.status,
    userId: s.userId?._id?.toString() || s.userId?.toString(),
    email: s.userId?.email || "",
    mines: s.mines || [],
  }));
}

/**
 * Update attendance record total dispensed
 */
export async function updateAttendanceTotalService(
  attendanceId: string,
  litresSold: number,
) {
  await connectDB();

  const attendance = await DispenserAttendanceRecord.findById(attendanceId);
  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  attendance.totalDispensed = (attendance.totalDispensed || 0) + litresSold;
  await attendance.save();

  return attendance;
}

export async function getCurrentAttendanceForUserService(
  userId: string,
  dispenserId: string,
) {
  await connectDB();

  const attendance = await DispenserAttendanceRecord.findOne({
    userId: new Types.ObjectId(userId),
    dispenserId: new Types.ObjectId(dispenserId),
    status: "active",
  }).lean();

  return attendance;
}
