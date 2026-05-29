import Tanker from "@/models/tanker";
import TankerDispenser from "@/models/tanker-dispenser";
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

export async function updateTankerStockService(
  tankerId: string,
  newStockLevel: number,
) {
  await connectDB();

  const tanker = await Tanker.findById(tankerId);
  if (!tanker) {
    throw new Error("Tanker not found");
  }

  // Ensure stock doesn't exceed capacity
  if (newStockLevel > tanker.capacity) {
    newStockLevel = tanker.capacity;
  }

  // Ensure stock doesn't go below 0
  if (newStockLevel < 0) {
    newStockLevel = 0;
  }

  return await Tanker.findByIdAndUpdate(
    tankerId,
    {
      stockLevel: newStockLevel,
      lastReading: newStockLevel,
      lastReadingDate: new Date(),
    },
    { new: true },
  ).lean();
}

export async function getTankerByDispenserIdService(dispenserId: string) {
  await connectDB();

  const connection = (await TankerDispenser.findOne({
    dispenserId: new Types.ObjectId(dispenserId),
    isActive: true,
  }).lean()) as any;

  if (!connection) {
    return null;
  }

  const tanker = await Tanker.findById(connection.tankerId).lean();
  return tanker;
}
