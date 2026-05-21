"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import {
  connectDispenserService,
  disconnectDispenserService,
  getTankerDispensersService,
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

    // Check if connection already exists
    const existingConnections = await getTankerDispensersService(tankerId);
    const alreadyConnected = existingConnections.some(
      (conn: any) => conn.dispenserId.toString() === dispenserId,
    );

    if (alreadyConnected) {
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
    return {
      message: "Failed to connect dispenser",
      errors: { global: error.message },
    };
  }
}

export async function disconnectDispenserFromTankerAction(
  tankerId: string,
  dispenserId: string,
) {
  try {
    await disconnectDispenserService(tankerId, dispenserId);

    revalidatePath(`/tankers/${tankerId}`);
    return { success: true, message: "Dispenser disconnected successfully" };
  } catch (error: any) {
    console.error("❌ disconnectDispenserFromTankerAction error:", error);
    return { success: false, error: error.message };
  }
}
