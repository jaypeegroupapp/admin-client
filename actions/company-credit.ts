// actions/company-credit.ts
"use server";

import { creditFormSchema } from "@/validations/company-credit";
import { addCompanyCreditService } from "@/services/company-credit";
import { revalidatePath } from "next/cache";

export async function addCompanyCreditAction(
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
    await addCompanyCreditService(companyId, {
      amount: creditAmount,
      reason: "Credit added via admin",
      issuedDate,
    });
    revalidatePath(`company/${companyId}`);

    return { message: "Credit added successfully", errors: {} };
  } catch (error: any) {
    console.error("❌ addCompanyCreditAction error:", error);
    return {
      message: "Failed to add credit",
      errors: { global: error.message },
    };
  }
}
