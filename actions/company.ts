"use server";

import { discountFormSchema } from "@/validations/company";
import { updateCompanyDiscountAmountService } from "@/services/company";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { companyFormSchema } from "@/validations/company";
import { createCompanyService } from "@/services/company";

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

export async function registerCompanyAction(
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
    const {
      name,
      registrationNumber,
      contactEmail,
      contactPhone,
      billingAddress,
      vatNumber,
      invoiceFile,
    } = validated.data;
    console.log("invoiceFile", invoiceFile);

    /* let fileId = "";

    if (invoiceFile && invoiceFile.size > 0) {
      const fileFormData = new FormData();
      fileFormData.append("file", invoiceFile);
      const uploadData = await uploadDoc(fileFormData);

      if (!uploadData.success) {
        console.log("uploadData", uploadData);
        return { message: uploadData.message, errors: {} };
      }

      fileId = uploadData.filename || "";
    } */

    await createCompanyService({
      name,
      registrationNumber,
      contactEmail,
      contactPhone,
      billingAddress,
      vatNumber,
    });
  } catch (error: any) {
    console.error("❌ registerCompanyAction error:", error);
    return {
      message: "Failed to save company details",
      errors: { global: [error.message] },
    };
  }

  redirect("/companies");
}
