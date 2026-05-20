"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { tankerFormSchema } from "@/validations/tanker";
import {
  createTankerService,
  updateTankerService,
  deleteTankerService,
  getTankerByIdService,
  updateTankerPublishStatusService,
} from "@/services/tanker";
import { ITanker } from "@/definitions/tanker";

export async function createTankerAction(
  tankerId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      name: formData.get("name"),
      productId: formData.get("productId"),
      stockLevel: formData.get("stockLevel")
        ? Number(formData.get("stockLevel"))
        : 0,
      capacity: formData.get("capacity") ? Number(formData.get("capacity")) : 0,
      isPublished: formData.get("isPublished") === "true",
      userId: formData.get("userId") || undefined,
    };

    const validated = tankerFormSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as ITanker;

    if (tankerId) {
      const existingTanker = await getTankerByIdService(tankerId);
      if (!existingTanker) {
        return {
          message: "Tanker not found",
          errors: { global: "Invalid tanker ID" },
        };
      }
      await updateTankerService(tankerId, data);
    } else {
      await createTankerService(data);
    }
  } catch (error: any) {
    console.error("❌ createTankerAction error:", error);
    return {
      message: "Failed to create or update tanker",
      errors: { global: error.message },
    };
  }

  let url = tankerId ? `/tankers/${tankerId}` : "/tankers";
  revalidatePath(url);
  redirect(url);
}

export async function deleteTankerAction(id: string) {
  try {
    await deleteTankerService(id);
    revalidatePath("/tankers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleTankerPublishAction(
  id: string,
  isPublished: boolean,
) {
  try {
    await updateTankerPublishStatusService(id, isPublished);
    revalidatePath("/tankers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
