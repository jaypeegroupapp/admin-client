// src/services/mine.ts
import Mine from "@/models/mine";
import { IMine } from "@/definitions/mine";
import { connectDB } from "@/lib/db";

export async function getAllMinesService() {
  await connectDB();
  return await Mine.find().sort({ createdAt: -1 }).lean();
}

export async function getMineByIdService(id: string) {
  await connectDB();
  return await Mine.findById(id).lean();
}

export async function createMineService(data: IMine) {
  await connectDB();
  return await Mine.create(data);
}

export async function updateMineService(id: string, data: Partial<IMine>) {
  await connectDB();
  return await Mine.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMineService(id: string) {
  await connectDB();
  return await Mine.findByIdAndDelete(id);
}
