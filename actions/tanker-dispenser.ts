"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import {
  connectDispenserService,
  disconnectDispenserService,
  getActiveConnectionService,
} from "@/services/tanker-dispenser";
import { connectDispenserSchema } from "@/validations/tanker-dispenser";

export async function connectDispenserToTankerAction(
  tankerId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    await connectDB();

    const validated = connectDispenserSchema.safeParse({
      dispenserId: formData.get("dispenserId"),
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { dispenserId } = validated.data;

    // Check if connection already exists and is active
    const existingConnection = await getActiveConnectionService(
      tankerId,
      dispenserId,
    );

    if (existingConnection) {
      return {
        message: "Dispenser is already connected to this tanker",
        errors: { dispenserId: ["Already connected"] },
      };
    }

    await connectDispenserService(tankerId, dispenserId);

    revalidatePath(`/tankers/${tankerId}`);
    return { success: true, message: "Dispenser connected successfully" };
  } catch (error: any) {
    console.error("❌ connectDispenserToTankerAction error:", error);

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return {
        message: "Dispenser is already connected to this tanker",
        errors: { dispenserId: ["This dispenser is already connected"] },
      };
    }

    return {
      message: error.message || "Failed to connect dispenser",
      errors: { global: error.message },
    };
  }
}

export async function disconnectDispenserFromTankerAction(
  tankerId: string,
  dispenserId: string,
) {
  try {
    await connectDB();

    const result = await disconnectDispenserService(tankerId, dispenserId);

    if (!result) {
      return { success: false, error: "Connection not found" };
    }

    revalidatePath(`/tankers/${tankerId}`);
    return { success: true, message: "Dispenser disconnected successfully" };
  } catch (error: any) {
    console.error("❌ disconnectDispenserFromTankerAction error:", error);
    return { success: false, error: error.message };
  }
}
