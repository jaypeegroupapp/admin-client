"use server";

import {
  getAllTankersService,
  getTankerByIdService,
  getTotalStockByProductIdService,
} from "@/services/tanker";
import { ITanker } from "@/definitions/tanker";

const mapTanker = (tanker: any): ITanker => ({
  id: tanker._id?.toString?.() ?? tanker.id ?? "",
  name: tanker.name,
  productId: tanker.productId?._id?.toString() ?? tanker.productId,
  productName: tanker.productId?.name,
  stockLevel: tanker.stockLevel ?? 0,
  capacity: tanker.capacity ?? 0,
  isPublished: tanker.isPublished ?? false,
  userId: tanker.userId?._id?.toString() ?? tanker.userId,
  attendanceName: tanker.userId?.name,
  createdAt: tanker.createdAt,
  updatedAt: tanker.updatedAt,
});

export async function getTankers() {
  try {
    const result = await getAllTankersService();
    const tankers = Array.isArray(result) ? result.map(mapTanker) : [];
    return { success: true, data: tankers };
  } catch (error: any) {
    console.error("❌ getTankers error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch tankers",
    };
  }
}

export async function getTankerById(id: string) {
  try {
    const result = await getTankerByIdService(id);
    if (!result) return { success: false, message: "Tanker not found" };
    return { success: true, data: mapTanker(result) };
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
}

export async function getTotalStockByProduct(productId: string) {
  try {
    const total = await getTotalStockByProductIdService(productId);
    return { success: true, totalStock: total };
  } catch (error: any) {
    return { success: false, totalStock: 0, message: error?.message };
  }
}
