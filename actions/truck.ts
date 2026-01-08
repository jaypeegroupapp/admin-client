// actions/truck.ts
"use server";
import { revalidatePath } from "next/cache"; // optional if you use ISR/revalidation
import { deleteTruckService } from "@/services/truck";

export async function deleteTruckAction(truckId: string) {
  try {
    await deleteTruckService(truckId);
    revalidatePath("/trucks");

    return { success: true, message: "Truck deleted successfully." };
  } catch (error: any) {
    console.error("❌ deleteTruckAction error:", error);
    return { success: false, message: "Failed to delete truck." };
  }
}
