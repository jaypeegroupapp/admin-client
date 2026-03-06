"use server";

import { redirect } from "next/navigation";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { createCashTransactionService } from "@/services/cash-transactions";

export async function createCashTransactionAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = cashTransactionFormSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await createCashTransactionService(validated.data);
  } catch (error: any) {
    console.error("❌ createCashTransactionAction error:", error);
    return {
      message: "Failed to create transaction",
      errors: { global: [error.message] },
    };
  }

  redirect("/cash-transactions");
}
