// src/data/product.ts
"use server";

import {
  getAllProductsService,
  getProductByIdService,
} from "@/services/product";
import { IProduct } from "@/definitions/product";

const mapProduct = (product: any): IProduct => ({
  id: product._id?.toString?.() ?? product.id ?? "",
  name: product.name,
  description: product.description,
  price: product.price,
  stock: product.stock,
  categoryId: product.categoryId?.toString?.() ?? product.categoryId ?? "",
  imageUrl: product.imageUrl ?? "",
  isPublished: product.isPublished ?? false,
});

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
    const product = await getProductByIdService(id);
    if (!product) return { success: false, message: "Product not found" };
    return { success: true, data: mapProduct(product) };
  } catch (error: any) {
    console.error("❌ getProductById error:", error);
    return { success: false, message: error.message };
  }
}
