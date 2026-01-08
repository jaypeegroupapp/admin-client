"use server";
// services/truck.ts
import { connectDB } from "@/lib/db";
import Truck from "@/models/truck";
import { Types } from "mongoose";

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

    const trucks = await Truck.find()
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
