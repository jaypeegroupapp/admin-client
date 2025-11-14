// src/services/product.services.ts
import Product from "@/models/product";
import { IProduct } from "@/definitions/product";
import { connectDB } from "@/lib/db";

export async function getAllProductsService() {
  await connectDB();
  return await Product.find().sort({ createdAt: -1 }).lean();
}

export async function getProductByIdService(id: string) {
  await connectDB();
  return await Product.findById(id).lean();
}

export async function createProductService(data: IProduct) {
  await connectDB();
  return await Product.create(data);
}

export async function updateProductService(
  id: string,
  data: Partial<IProduct>
) {
  await connectDB();
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProductService(id: string) {
  await connectDB();
  return await Product.findByIdAndDelete(id);
}
