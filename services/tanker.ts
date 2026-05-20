import Tanker from "@/models/tanker";
import { ITanker } from "@/definitions/tanker";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

export async function getAllTankersService() {
  await connectDB();
  return await Tanker.find()
    .populate("productId", "name description grid")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getTankerByIdService(id: string) {
  await connectDB();
  return await Tanker.findById(id)
    .populate("productId")
    .populate("userId")
    .lean();
}

export async function getTankersByProductIdService(productId: string) {
  await connectDB();
  return await Tanker.find({ productId: new Types.ObjectId(productId) })
    .populate("productId", "name description grid")
    .sort({ createdAt: -1 })
    .lean();
}

export async function createTankerService(data: Partial<ITanker>) {
  await connectDB();
  return await Tanker.create(data);
}

export async function updateTankerService(id: string, data: Partial<ITanker>) {
  await connectDB();
  return await Tanker.findByIdAndUpdate(id, data, { new: true })
    .populate("productId")
    .populate("userId")
    .lean();
}

export async function deleteTankerService(id: string) {
  await connectDB();
  return await Tanker.findByIdAndDelete(id);
}

export async function updateTankerPublishStatusService(
  id: string,
  isPublished: boolean,
) {
  await connectDB();
  return await Tanker.findByIdAndUpdate(id, { isPublished }, { new: true });
}

export async function getTotalStockByProductIdService(productId: string) {
  await connectDB();
  const result = await Tanker.aggregate([
    { $match: { productId: new Types.ObjectId(productId), isPublished: true } },
    { $group: { _id: "$productId", totalStock: { $sum: "$stockLevel" } } },
  ]);
  return result[0]?.totalStock || 0;
}
