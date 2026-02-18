"use server";

import { discountFormSchema } from "@/validations/company";
import { updateCompanyDiscountAmountService } from "@/services/company";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderDiscountAction(
  companyId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const rawValues = Object.fromEntries(formData);

    const validated = discountFormSchema.safeParse(rawValues);

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await updateCompanyDiscountAmountService(
      companyId,
      validated.data.discount
    );
  } catch (error: any) {
    console.error("❌ updateOrderDiscountAction error:", error);
    return {
      message: "Failed to apply discount",
      errors: { global: error.message },
    };
  }

  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}
