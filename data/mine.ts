"use server";

import { getAllMinesService, getMineByIdService } from "@/services/mine";
import { IMine } from "@/definitions/mine";

const mapMine = (mine: any): IMine => ({
  id: mine._id?.toString?.() ?? mine.id ?? "",
  name: mine.name,
  isActive: mine.isActive ?? false,
  createdAt: mine.createdAt?.toISOString?.() ?? "",
  updatedAt: mine.updatedAt?.toISOString?.() ?? "",
});

export async function getMines() {
  try {
    const result = await getAllMinesService();
    const mines = Array.isArray(result) ? result.map(mapMine) : [];
    return { success: true, data: mines };
  } catch (error: any) {
    console.error("❌ getMines error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch mines",
    };
  }
}

export async function getMineById(id: string) {
  try {
    const mine = await getMineByIdService(id);
    if (!mine) return { success: false, message: "Mine not found" };
    return { success: true, data: mapMine(mine) };
  } catch (error: any) {
    console.error("❌ getMineById error:", error);
    return { success: false, message: error.message };
  }
}

import { connectDB } from "@/lib/db";
import Staff from "@/models/staff";
import Mine from "@/models/mine";

export async function getMinesByStaff(staffId: string) {
  await connectDB();

  const staff = await Staff.findById(staffId).select("mines").lean();
  if (!staff) return [];

  const mines = await Mine.find({
    _id: { $in: staff.mines },
  }).lean();

  return mines.map((m: any) => ({
    id: m._id.toString(),
    name: m.name,
    createdAt: m.createdAt,
  }));
}
