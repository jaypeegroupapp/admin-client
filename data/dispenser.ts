// src/data/dispenser.ts
"use server";

import {
  getAllDispensersService,
  getDispenserByIdService,
} from "@/services/dispenser";
import { IDispenser } from "@/definitions/dispenser";

export async function getDispensers() {
  try {
    const result = await getAllDispensersService();
    const dispensers = Array.isArray(result) ? result.map(mapDispenser) : [];
    return { success: true, data: dispensers };
  } catch (error: any) {
    console.error("❌ getDispensers error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch dispensers",
    };
  }
}

export async function getDispenserById(id: string) {
  try {
    const result = await getDispenserByIdService(id);
    if (!result) {
      return { success: false, message: "Dispenser not found" };
    }
    return { success: true, data: mapDispenser(result) };
  } catch (error: any) {
    console.error("❌ getDispenserById error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch dispenser",
    };
  }
}

function mapDispenser(doc: any): IDispenser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    productId: doc.productId?._id?.toString() || doc.productId?.toString(),
    litres: doc.litres ?? 0,
    isPublished: doc.isPublished ?? false,
    userId: doc.userId?._id?.toString() || doc.userId?.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
