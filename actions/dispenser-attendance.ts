// src/actions/dispenser-attendance.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  assignAttendantService,
  removeAttendantService,
  getCurrentAttendanceService,
} from "@/services/dispenser-attendance";
import { getStaffByIdService } from "@/services/staff";

const assignAttendantSchema = z.object({
  attendantId: z.string().min(1, "Attendant is required"),
  openingBalance: z.coerce
    .number()
    .min(0, "Opening balance must be 0 or greater"),
  notes: z.string().optional(),
});

const removeAttendantSchema = z.object({
  closingBalance: z.coerce
    .number()
    .min(0, "Closing balance must be 0 or greater"),
  notes: z.string().optional(),
});

export async function assignAttendantAction(
  dispenserId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    // Check if dispenser already has active attendance
    const currentAttendance = await getCurrentAttendanceService(dispenserId);
    if (currentAttendance) {
      return {
        message: "Dispenser already has an active attendant",
        errors: { global: "Please end the current shift first" },
      };
    }

    const validated = assignAttendantSchema.safeParse({
      attendantId: formData.get("attendantId"),
      openingBalance: formData.get("openingBalance"),
      notes: formData.get("notes") || undefined,
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    // Get attendant details
    const attendant = await getStaffByIdService(data.attendantId);
    if (!attendant) {
      return {
        message: "Attendant not found",
        errors: { attendantId: ["Invalid attendant selected"] },
      };
    }

    // Create attendance record
    await assignAttendantService({
      dispenserId,
      userId: attendant.userId,
      attendantId: data.attendantId,
      openingBalance: data.openingBalance,
      notes: data.notes,
    });
  } catch (error: any) {
    console.error("❌ assignAttendantAction error:", error);
    return {
      message: "Failed to assign attendant",
      errors: { global: error.message },
    };
  }

  revalidatePath(`/dispensers/${dispenserId}`);
  return { success: true, message: "Attendant assigned successfully" };
}

export async function removeAttendantAction(
  attendanceRecordId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = removeAttendantSchema.safeParse({
      closingBalance: formData.get("closingBalance"),
      notes: formData.get("notes") || undefined,
    });

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data;

    // End shift and record closing balance
    const result = await removeAttendantService({
      attendanceRecordId,
      closingBalance: data.closingBalance,
      notes: data.notes,
    });

    revalidatePath(`/dispensers/${result.dispenserId}`);
  } catch (error: any) {
    console.error("❌ removeAttendantAction error:", error);
    return {
      message: "Failed to end shift",
      errors: { global: error.message },
    };
  }

  return { success: true, message: "Shift ended successfully" };
}
