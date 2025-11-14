"use server";
// services/truck.ts
import { connectDB } from "@/lib/db";
import Truck from "@/models/truck";
import { ITruck } from "@/definitions/truck";
import { Types } from "mongoose";
import { verifySession } from "@/lib/dal";

/**
 * ✅ Create Truck
 */
export async function createTruckService(data: ITruck) {
  await connectDB();
  const session = await verifySession();
  if (!session) return null;

  const userId = session?.userId as string;

  try {
    const truck = await Truck.create({
      ...data,
      userId: new Types.ObjectId(userId),
    });
    return JSON.parse(JSON.stringify(truck));
  } catch (error: any) {
    console.error("❌ createTruckService error:", error);
    throw new Error("Failed to create truck");
  }
}

/**
 * ✅ Update Truck
 */
export async function updateTruckService(
  truckId: string,
  data: Partial<ITruck>
) {
  await connectDB();
  const session = await verifySession();
  if (!session) return null;

  const userId = session?.userId as string;

  try {
    const updatedTruck = await Truck.findByIdAndUpdate(
      truckId,
      {
        ...data,
        userId: new Types.ObjectId(userId),
      },
      {
        new: true,
      }
    );
    return JSON.parse(JSON.stringify(updatedTruck));
  } catch (error: any) {
    console.error("❌ updateTruckService error:", error);
    throw new Error("Failed to update truck");
  }
}

/**
 * ✅ Delete Truck
 */
export async function deleteTruckService(truckId: string) {
  await connectDB();
  try {
    await Truck.findByIdAndDelete(truckId);
    return { success: true };
  } catch (error: any) {
    console.error("❌ deleteTruckService error:", error);
    throw new Error("Failed to delete truck");
  }
}

/**
 * ✅ Get all Trucks (optionally by company or user)
 */
export async function getTrucksService() {
  await connectDB();
  try {
    const query: any = {};

    const session = await verifySession();
    if (!session) return null;

    const userId = session?.userId as string;
    query.userId = new Types.ObjectId(userId);

    const trucks = await Truck.find(query)
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(trucks));
  } catch (error: any) {
    console.error("❌ getTrucksService error:", error);
  }
}

/**
 * ✅ Get Truck by ID
 */
export async function getTruckByIdService(truckId: string) {
  await connectDB();
  try {
    const truck = await Truck.findById(truckId).populate("userId", "email");
    return JSON.parse(JSON.stringify(truck));
  } catch (error: any) {
    console.error("❌ getTruckByIdService error:", error);
    throw new Error("Failed to fetch truck");
  }
}

export async function getTruckByCompanyIdService(companyId: string) {
  await connectDB();
  try {
    const truck = await Truck.find({
      companyId: new Types.ObjectId(companyId),
    }).populate("userId", "email");
    return JSON.parse(JSON.stringify(truck));
  } catch (error: any) {
    console.error("❌ getTruckByIdService error:", error);
    throw new Error("Failed to fetch truck");
  }
}

export async function isTruckExist(truckData: any) {
  await connectDB();
  return await Truck.findOne(truckData);
}
