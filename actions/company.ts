// /actions/company.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { companyFormSchema } from "@/validations/company";
import { createCompanyService } from "@/services/company";
import { uploadDoc, uploadFile } from "./file";
import { verifySession } from "@/lib/dal";
import { setCookie } from "@/lib/session";

export async function registerCompanyAction(
  prevState: any,
  formData: FormData
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
      companyName,
      registrationNumber,
      contactEmail,
      contactPhone,
      billingAddress,
      vatNumber,
      invoiceFile,
    } = validated.data;
    console.log("invoiceFile", invoiceFile);

    let fileId = "";

    if (invoiceFile && invoiceFile.size > 0) {
      const fileFormData = new FormData();
      fileFormData.append("file", invoiceFile);
      const uploadData = await uploadDoc(fileFormData);

      if (!uploadData.success) {
        console.log("uploadData", uploadData);
        return { message: uploadData.message, errors: {} };
      }

      fileId = uploadData.filename || "";
    }

    const session = await verifySession();
    if (!session) return null;

    const userId = session?.userId as string;

    await createCompanyService({
      companyName,
      registrationNumber,
      contactEmail,
      contactPhone,
      billingAddress,
      vatNumber,
      invoiceFile: fileId,
      userId,
    });
    await setCookie("registrationStep", "1");
  } catch (error: any) {
    console.error("❌ registerCompanyAction error:", error);
    return {
      message: "Failed to save company details",
      errors: { global: [error.message] },
    };
  }

  redirect("/");
}
