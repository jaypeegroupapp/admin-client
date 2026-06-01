import Product from "@/models/product";
import Tanker from "@/models/tanker";
import { IProduct } from "@/definitions/product";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

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
  data: Partial<IProduct>,
) {
  await connectDB();
  return await Product.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProductService(id: string) {
  await connectDB();
  return await Product.findByIdAndDelete(id);
}

export async function updateProductPublishStatusService(
  id: string,
  isPublished: boolean,
) {
  await connectDB();
  return await Product.findByIdAndUpdate(id, { isPublished }, { new: true });
}

export async function getTotalProductStockFromTankersService(
  productId: string,
) {
  await connectDB();

  const result = await Tanker.aggregate([
    {
      $match: {
        productId: new Types.ObjectId(productId),
        isPublished: true,
      },
    },
    {
      $group: {
        _id: "$productId",
        totalStock: { $sum: "$stockLevel" },
        totalCapacity: { $sum: "$capacity" },
      },
    },
  ]);

  return {
    totalStock: result[0]?.totalStock || 0,
    totalCapacity: result[0]?.totalCapacity || 0,
  };
}
