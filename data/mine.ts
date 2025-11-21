"use server";

import { getAllMinesService, getMineByIdService } from "@/services/mine";
import { IMine } from "@/definitions/mine";

const mapMine = (mine: any): IMine => ({
  id: mine._id?.toString?.() ?? mine.id ?? "",
  name: mine.name,
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
