"use server";
// actions/staff.ts

import { staffFormSchema } from "@/validations/staff";
import {
  createStaffService,
  updateStaffService,
  getStaffByIdService,
} from "@/services/staff";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUserService } from "@/services/auth";

export async function createStaffAction(
  staffId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = staffFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, email, role, status } = validated.data;

    let userId: string | undefined;

    if (staffId) {
      const existing = await getStaffByIdService(staffId);

      if (!existing) {
        return {
          message: "Staff not found",
          errors: { global: "Invalid staff ID" },
        };
      }

      userId = existing.userId.toString();

      await updateStaffService(staffId, {
        name,
        status,
      });
    } else {
      // 1️⃣ CREATE USER FIRST
      const user = (await createUserService(email || "", role)) as any;

      // 2️⃣ CREATE STAFF WITH USER ID
      await createStaffService({
        name,
        status,
        userId: user._id.toString(),
        mines: [],
      });
    }
  } catch (error: any) {
    console.error("❌ createStaffAction error:", error);
    return {
      message: "Failed to create or update staff",
      errors: { global: error.message },
    };
  }

  const url = staffId ? `/staffs/${staffId}` : "/staffs";
  revalidatePath(url);
  redirect(url);
}
