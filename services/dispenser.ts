// src/services/dispenser.ts
import Dispenser from "@/models/dispenser";
import { IDispenser } from "@/definitions/dispenser";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";
import DispenserAttendanceRecord from "@/models/dispenser-attendance";

export async function getAllDispensersService() {
  await connectDB();
  return await Dispenser.find()
    .populate("productId", "name description grid")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getDispenserByIdService(id: string) {
  await connectDB();
  return await Dispenser.findById(id)
    .populate("productId")
    .populate("userId")
    .lean();
}

export async function createDispenserService(data: Partial<IDispenser>) {
  await connectDB();
  return await Dispenser.create(data);
}

export async function updateDispenserService(
  id: string,
  data: Partial<IDispenser>,
) {
  await connectDB();
  return await Dispenser.findByIdAndUpdate(id, data, { new: true })
    .populate("productId")
    .populate("userId")
    .lean();
}

export async function deleteDispenserService(id: string) {
  await connectDB();
  return await Dispenser.findByIdAndDelete(id);
}

export async function updateDispenserPublishStatusService(
  id: string,
  isPublished: boolean,
) {
  await connectDB();
  return await Dispenser.findByIdAndUpdate(id, { isPublished }, { new: true });
}

export async function getDispenserByUserIdService(userId: string) {
  await connectDB();

  const dispenser = await Dispenser.findOne({
    userId: new Types.ObjectId(userId),
    isPublished: true,
  })
    .populate("productId", "name price")
    .lean();

  return dispenser;
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
