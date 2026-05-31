"use server";

import { discountFormSchema } from "@/validations/company";
import {
  deleteCompanyService,
  getCompanyByIdService,
  updateCompanyDiscountAmountService,
  updateCompanyService,
} from "@/services/company";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { companyFormSchema } from "@/validations/company";
import { createCompanyService } from "@/services/company";
import { ICompany } from "@/definitions/company";

export async function updateOrderDiscountAction(
  companyId: string,
  prevState: any,
  formData: FormData,
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
      validated.data.discount,
      validated.data.isGridPlus == "true",
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

export async function createCompanyAction(
  companyId: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = companyFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as ICompany;

    if (companyId) {
      const existingCompany = await getCompanyByIdService(companyId);
      if (!existingCompany) {
        return {
          message: "Company not found",
          errors: { global: "Invalid company ID" },
        };
      }
      await updateCompanyService(companyId, data);
    } else {
      await createCompanyService(data);
    }
  } catch (error: any) {
    console.error("❌ createCompanyAction error:", error);
    return {
      message: "Failed to create or update company",
      errors: { global: error.message },
    };
  }

  let url = companyId ? `/companies/${companyId}` : "/companies";
  revalidatePath(url);
  redirect(url);
}

export async function deleteCompanyAction(companyId: string) {
  try {
    await deleteCompanyService(companyId);
    revalidatePath("/companies");
    return { success: true, message: "Company deleted successfully." };
  } catch (error: any) {
    console.error("❌ deleteCompanyAction error:", error);
    return { success: false, message: "Failed to delete company." };
  }
}
