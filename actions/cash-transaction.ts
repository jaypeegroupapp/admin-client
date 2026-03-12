// src/actions/cash-transaction.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import {
  completeCashTransactionService,
  createCashTransactionService,
} from "@/services/cash-transactions";
import { getSession } from "@/lib/session";
import { getProductByIdService } from "@/services/product";

export async function createCashTransactionAction(
  prevState: any,
  formData: FormData,
) {
  try {
    // Get current user from session
    const session = (await getSession()) as any;
    if (!session?.user?.id) {
      return {
        message: "User not authenticated",
        errors: { global: ["Please log in to continue"] },
      };
    }

    const validated = cashTransactionFormSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    // Get product details for grid and discount
    const product = (await getProductByIdService(
      validated.data.productId,
    )) as any;
    if (!product) {
      return {
        message: "Product not found",
        errors: { productId: ["Selected product not found"] },
      };
    }

    // Create transaction with pending status (to be completed by attendant)
    await createCashTransactionService({
      ...validated.data,
      grid: product.grid || 0,
      plusDiscount: product.discount || 0,
      productName: product.name,
      status: "pending", // Start as pending for dispenser completion
    });
  } catch (error: any) {
    console.error("❌ createCashTransactionAction error:", error);
    return {
      message: "Failed to create transaction",
      errors: { global: [error.message] },
    };
  }

  revalidatePath("/cash-transactions");
  redirect("/cash-transactions");
}

export async function completeCashTransactionAction(
  transactionId: string,
  signature: string,
) {
  try {
    const session = (await getSession()) as any;
    if (!session?.user?.id) {
      return { success: false, message: "User not authenticated" };
    }

    const result = await completeCashTransactionService(
      transactionId,
      session.user.id,
      signature,
    );

    if (!result.success) {
      return { success: false, message: result.message };
    }

    revalidatePath("/cash-transactions");
    revalidatePath(`/dispensers/${result.dispenserId}`);

    return {
      success: true,
      message: "Transaction completed successfully",
      data: result.data,
    };
  } catch (error) {
    console.error("❌ completeCashTransactionAction error:", error);
    return { success: false, message: "Failed to complete transaction" };
  }
}
