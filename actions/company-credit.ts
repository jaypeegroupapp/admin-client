// actions/company-credit.ts
"use server";

import {
  creditFormSchema,
  creditMineFormSchema,
} from "@/validations/company-credit";
import {
  updateCompanyCreditService,
  updateCompanyCreditTrailService,
} from "@/services/company-credit";
import { revalidatePath } from "next/cache";
import { uploadFileGetFileId } from "./file";
import { allowedTypes } from "@/constants/company-credit";
import { z } from "zod";

export async function updateCompanyCreditTrailAction(
  companyId: string,
  prevState: any,
  formData: FormData
) {
  try {
    // Validate form
    const validated = creditFormSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { amount, issuedDate } = validated.data;
    const creditAmount = parseFloat(amount);

    // Call the service
    await updateCompanyCreditTrailService(companyId, {
      amount: creditAmount,
      reason: "Credit added via admin",
      issuedDate,
    });
    revalidatePath(`company/${companyId}`);

    return { message: "Credit added successfully", errors: {} };
  } catch (error: any) {
    console.error("❌ updateCompanyCreditTrailAction error:", error);
    return {
      message: "Failed to add credit",
      errors: { global: error.message },
    };
  }
}

export async function updateCompanyCreditAction(
  companyId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const rawValues = Object.fromEntries(formData);

    // Detect if we're updating
    const creditId = formData.get("creditId") as string | null;
    const isUpdate = Boolean(creditId);

    // Conditionally require mineId only for creation
    const schema = creditMineFormSchema.extend({
      mineId: isUpdate
        ? z.string().optional() // optional for update
        : z.string().min(1, "Mine is required"), // required for create
    });

    const validated = schema.safeParse(rawValues);

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    // Handle file
    const file = formData.get("document") as File | null;

    if (!file || file.size === 0) {
      return {
        message: "Validation failed",
        errors: { document: ["Document is required"] },
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        message: "Validation failed",
        errors: { document: ["Invalid file type"] },
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        message: "Validation failed",
        errors: { document: ["File must be less than 5MB"] },
      };
    }

    // Upload file
    const uploadForm = new FormData();
    uploadForm.append("document", file);

    const uploadRes = (await uploadFileGetFileId(uploadForm)) as any;

    if (!uploadRes.success) {
      return {
        message: "File upload failed",
        errors: { document: [uploadRes.message] },
      };
    }

    const fileId = uploadRes.fileId;

    // Save or update credit
    if (isUpdate) {
      await updateCompanyCreditService(companyId, {
        creditId,
        creditLimit: validated.data.creditLimit,
        requester: validated.data.requester,
        reason: validated.data.reason,
        document: fileId,
      });
      return { message: "Credit record updated successfully", errors: {} };
    } else {
      await updateCompanyCreditService(companyId, {
        mineId: validated.data.mineId!,
        creditLimit: validated.data.creditLimit,
        requester: validated.data.requester,
        reason: validated.data.reason,
        document: fileId,
      });
      return { message: "Credit record created successfully", errors: {} };
    }
  } catch (error: any) {
    console.error("❌ updateCompanyCreditAction error:", error);
    return {
      message: "Failed to create/update credit record",
      errors: { global: error.message },
    };
  }
}
