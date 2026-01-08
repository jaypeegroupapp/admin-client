import { IStaff } from "@/definitions/staff";
import { connectDB } from "@/lib/db";
import Staff from "@/models/staff";
import { Types } from "mongoose";

export async function getAllStaffService() {
  await connectDB();
  return await Staff.find().sort({ createdAt: -1 }).lean();
}

export async function getStaffByIdService(id: string) {
  await connectDB();
  return await Staff.findById(id).lean();
}

export async function getStaffService(id: string) {
  await connectDB();
  return await Staff.findOne({ userId: new Types.ObjectId(id) }).lean();
}

export async function createStaffService(data: IStaff) {
  await connectDB();
  return await Staff.create(data);
}

export async function updateStaffService(id: string, data: Partial<IStaff>) {
  await connectDB();
  return await Staff.findByIdAndUpdate(id, data, { new: true });
}
