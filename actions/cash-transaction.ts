// src/actions/cash-transaction.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { createCashTransactionService } from "@/services/cash-transactions";
import { getSession } from "@/lib/session";
import { getProductByIdService } from "@/services/product";
import { getDispenserByUserIdService } from "@/services/dispenser";
import {
  getCurrentAttendanceForUserService,
  updateAttendanceTotalService,
} from "@/services/dispenser-attendance";
import { updateDispenserStockService } from "@/services/dispenser-stock-record";
import { createDispenserUsageService } from "@/services/dispenser-usage";

// src/actions/cash-transaction.ts (updated)
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

    // Get product details
    const product = (await getProductByIdService(
      validated.data.productId,
    )) as any;
    if (!product) {
      return {
        message: "Product not found",
        errors: { productId: ["Selected product not found"] },
      };
    }

    // Get dispenser assigned to user
    const dispenser = (await getDispenserByUserIdService(
      session.user.id,
    )) as any;
    if (!dispenser) {
      return {
        message: "No dispenser assigned",
        errors: {
          global: ["No dispenser assigned to you. Please contact manager."],
        },
      };
    }

    // Get active attendance
    const attendance = (await getCurrentAttendanceForUserService(
      session.user.id,
      dispenser._id.toString(),
    )) as any;
    if (!attendance) {
      return {
        message: "Not logged into dispenser",
        errors: {
          global: [
            "You are not logged into the dispenser. Please log in first.",
          ],
        },
      };
    }

    // Check stock
    if (dispenser.litres < validated.data.litresPurchased) {
      return {
        message: "Insufficient stock",
        errors: { litresPurchased: [`Available stock: ${dispenser.litres}L`] },
      };
    }

    // Calculate balance after transaction
    const balanceBefore = dispenser.litres;
    const balanceAfter = dispenser.litres - validated.data.litresPurchased;

    // Create transaction with dispenser info and completed status
    const transaction = await createCashTransactionService({
      ...validated.data,
      grid: product.grid || 0,
      plusDiscount: product.discount || 0,
      productName: product.name,
      status: "completed",
      dispenserId: dispenser._id.toString(),
      attendanceId: attendance._id.toString(),
      completedById: session.user.id,
      completedAt: (new Date()).toLocaleString(),
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
    });

    // Update dispenser stock
    await updateDispenserStockService(dispenser._id.toString(), balanceAfter);

    // Create dispenser usage record with full metadata
    await createDispenserUsageService({
      dispenserId: dispenser._id.toString(),
      litresDispensed: validated.data.litresPurchased,
      timestamp: new Date(),
      cashTransactionId: transaction._id.toString(),
      attendanceId: attendance._id.toString(),
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      type: "SALE",
      metadata: {
        companyName: validated.data.companyName,
        plateNumber: validated.data.plateNumber,
        driverName: validated.data.driverName,
      },
    });

    // Update attendance total
    await updateAttendanceTotalService(
      attendance._id.toString(),
      validated.data.litresPurchased,
    );
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
