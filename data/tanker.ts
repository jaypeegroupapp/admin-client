"use server";

import {
  getAllTankersService,
  getTankerByIdService,
  getTotalStockByProductIdService,
  getTankerByDispenserIdService,
  updateTankerStockService,
} from "@/services/tanker";
import { ITanker } from "@/definitions/tanker";

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
    if (!result) {
      return { success: false, message: "Tanker not found" };
    }
    return { success: true, data: mapTanker(result) };
  } catch (error: any) {
    console.error("❌ getTankerById error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch tanker",
    };
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

export async function getTankerByDispenserId(dispenserId: string) {
  try {
    const result = await getTankerByDispenserIdService(dispenserId);
    if (!result) {
      return { success: false, data: null, message: "No tanker connected" };
    }
    return { success: true, data: mapTanker(result) };
  } catch (error: any) {
    console.error("❌ getTankerByDispenserId error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch tanker",
      data: null,
    };
  }
}

export async function updateTankerStock(
  tankerId: string,
  newStockLevel: number,
) {
  try {
    const result = await updateTankerStockService(tankerId, newStockLevel);
    return { success: true, data: mapTanker(result) };
  } catch (error: any) {
    console.error("❌ updateTankerStock error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to update tanker stock",
    };
  }
}

/* export async function getTankersForProduct(productId: string) {
  try {
    await connectDB();
    const tankers = await Tanker.find({
      productId: new Types.ObjectId(productId),
      isPublished: true,
      stockLevel: { $gt: 0 },
    }).lean();

    const mappedTankers = tankers.map(mapTanker);
    return { success: true, data: mappedTankers };
  } catch (error: any) {
    console.error("❌ getTankersForProduct error:", error);
    return { success: false, data: [], message: error.message };
  }
} */

function mapTanker(doc: any): ITanker {
  return {
    id: doc._id.toString(),
    name: doc.name,
    productId: doc.productId?._id?.toString() || doc.productId?.toString(),
    productName: doc.productId?.name?.toString(),
    stockLevel: doc.stockLevel ?? 0,
    capacity: doc.capacity ?? 0,
    isPublished: doc.isPublished ?? false,
    userId: doc.userId?._id?.toString() || doc.userId?.toString(),
    attendanceName: doc.userId?.name,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
