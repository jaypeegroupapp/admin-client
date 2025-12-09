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
import { uploadFileAction } from "./file";
import { z } from "zod";
import { CompanyCreditState } from "@/definitions/company-credit";
import { redirect } from "next/navigation";

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
    const debitAmount = parseFloat(amount);

    // Call the service
    await updateCompanyCreditTrailService(companyId, {
      amount: debitAmount,
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
  prevState: CompanyCreditState | undefined,
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
      const state: CompanyCreditState = {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
      return state;
    }

    // Handle file
    const file = formData.get("document") as File | null;

    const uploadRes = (await uploadFileAction(file)) as any;
    if (uploadRes.errors) {
      return { message: uploadRes.message, errors: uploadRes.errors };
    }

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
    } else {
      await updateCompanyCreditService(companyId, {
        mineId: validated.data.mineId!,
        creditLimit: validated.data.creditLimit,
        requester: validated.data.requester,
        reason: validated.data.reason,
        document: fileId,
      });
    }
  } catch (error: any) {
    console.error("❌ updateCompanyCreditAction error:", error);
    return {
      message: "Failed to create/update credit record",
      errors: { global: error.message },
    };
  }
  revalidatePath(`companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}
