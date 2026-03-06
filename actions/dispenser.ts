// src/actions/dispenser.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dispenserFormSchema } from "@/validations/dispenser";
import {
  createDispenserService,
  updateDispenserService,
  deleteDispenserService,
  getDispenserByIdService,
  updateDispenserPublishStatusService,
} from "@/services/dispenser";
import { IDispenser } from "@/definitions/dispenser";

export async function createDispenserAction(
  dispenserId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const rawData = {
      name: formData.get("name"),
      productId: formData.get("productId"),
      litres: formData.get("litres") ? Number(formData.get("litres")) : 0,
      isPublished: formData.get("isPublished") === "true",
      userId: formData.get("userId") || undefined,
    };

    const validated = dispenserFormSchema.safeParse(rawData);

    if (!validated.success) {
      console.log(validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as IDispenser;

    if (dispenserId) {
      const existingDispenser = await getDispenserByIdService(dispenserId);
      if (!existingDispenser) {
        return {
          message: "Dispenser not found",
          errors: { global: "Invalid dispenser ID" },
        };
      }
      await updateDispenserService(dispenserId, data);
    } else {
      await createDispenserService(data);
    }
  } catch (error: any) {
    console.error("❌ createDispenserAction error:", error);
    return {
      message: "Failed to create or update dispenser",
      errors: { global: error.message },
    };
  }

  let url = dispenserId ? `/dispensers/${dispenserId}` : "/dispensers";
  revalidatePath(url);
  redirect(url);
}

export async function deleteDispenserAction(id: string) {
  try {
    await deleteDispenserService(id);
    revalidatePath("/dispensers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleDispenserPublishAction(
  id: string,
  isPublished: boolean,
) {
  try {
    await updateDispenserPublishStatusService(id, isPublished);
    revalidatePath("/dispensers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
