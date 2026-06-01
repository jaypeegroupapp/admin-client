"use server";

import {
  getAllProductsService,
  getProductByIdService,
  getTotalProductStockFromTankersService,
} from "@/services/product";
import { IProduct } from "@/definitions/product";

export async function getProducts() {
  try {
    const result = await getAllProductsService();
    const products = Array.isArray(result) ? result.map(mapProduct) : [];
    return { success: true, data: products };
  } catch (error: any) {
    console.error("❌ getProducts error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch products",
    };
  }
}

export async function getProductById(id: string) {
  try {
    const result = await getProductByIdService(id);
    if (!result) {
      return { success: false, message: "Product not found" };
    }
    return { success: true, data: mapProduct(result) };
  } catch (error: any) {
    console.error("❌ getProductById error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch product",
    };
  }
}

export async function getPublishedProducts() {
  try {
    const result = await getAllProductsService();
    const products = Array.isArray(result)
      ? result.filter((p) => p.isPublished).map(mapProduct)
      : [];
    return { success: true, data: products };
  } catch (error: any) {
    console.error("❌ getPublishedProducts error:", error);
    return {
      success: false,
      message: error?.message ?? "Unable to fetch products",
    };
  }
}

export async function getTotalProductStockFromTankers(productId: string) {
  try {
    const result = await getTotalProductStockFromTankersService(productId);
    return { success: true, ...result };
  } catch (error: any) {
    console.error("❌ getTotalProductStockFromTankers error:", error);
    return {
      success: false,
      totalStock: 0,
      totalCapacity: 0,
      message: error?.message,
    };
  }
}

function mapProduct(doc: any): IProduct {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    grid: doc.grid ?? 0,
    discount: doc.discount ?? 0,
    stock: doc.stock ?? 0,
    minStockThreshold: doc.minStockThreshold ?? 1000,
    isPublished: doc.isPublished ?? false,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}
