// actions/truck.ts
"use server";
import { revalidatePath } from "next/cache"; // optional if you use ISR/revalidation
import { redirect } from "next/navigation";
import { truckFormSchema } from "@/validations/truck";
import {
  createTruckService,
  updateTruckService,
  deleteTruckService,
  getTruckByIdService,
} from "@/services/truck";

export async function createTruckAction(
  truckId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = truckFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      console.log(validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    // 🧠 When updating — check that unique fields don’t conflict with other trucks
    if (truckId) {
      const existingTruck = await getTruckByIdService(truckId);
      if (!existingTruck) {
        return {
          message: "Truck not found",
          errors: { global: "Invalid truck ID" },
        };
      }

      await updateTruckService(truckId, data);
    }
    // 🧩 Otherwise, create a new truck
    else {
      await createTruckService(data);
    }
  } catch (error: any) {
    console.error("❌ createTruckAction error:", error);
    return {
      message: "Failed to create or update truck",
      errors: { global: error.message },
    };
  }

  revalidatePath("/trucks");
  redirect("/trucks");
}

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
