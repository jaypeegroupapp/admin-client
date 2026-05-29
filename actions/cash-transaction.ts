"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { cashTransactionFormSchema } from "@/validations/cash-transaction";
import { getProductByIdService } from "@/services/product";
import { getDispenserByUserIdService } from "@/services/dispenser";
import { getCurrentAttendanceForUserService } from "@/services/dispenser-attendance";
import { getTankerByDispenserIdService } from "@/services/tanker";
import { createCashTransactionService } from "@/services/cash-transactions";
import { updateTankerStockService } from "@/services/tanker-stock";
import { updateDispenserTotalService } from "@/services/dispenser";
import { createDispenserUsageService } from "@/services/dispenser-usage";
import { updateAttendanceTotalService } from "@/services/dispenser-attendance";
import { createTankerTransactionService } from "@/services/tanker-transaction";

export async function createCashTransactionAction(
  prevState: any,
  formData: FormData,
) {
  try {
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

    const product = (await getProductByIdService(
      validated.data.productId,
    )) as any;
    if (!product) {
      return {
        message: "Product not found",
        errors: { productId: ["Selected product not found"] },
      };
    }

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

    // Get connected tanker
    const tanker = (await getTankerByDispenserIdService(
      dispenser._id.toString(),
    )) as any;
    if (!tanker) {
      return {
        message: "No tanker connected",
        errors: {
          global: ["No tanker connected to this dispenser."],
        },
      };
    }

    // Check tanker stock
    if (tanker.stockLevel < validated.data.litresPurchased) {
      return {
        message: "Insufficient stock in tanker",
        errors: {
          litresPurchased: [`Available tanker stock: ${tanker.stockLevel}L`],
        },
      };
    }

    const tankerBeforeStock = tanker.stockLevel;
    const tankerAfterStock = tankerBeforeStock - validated.data.litresPurchased;
    const meterBefore = dispenser.totalDispensed || 0;
    const meterAfter = meterBefore + validated.data.litresPurchased;

    // Extract attendant name from populated data
    let attendantName = "Unknown Attendant";
    if (attendance.attendantId) {
      const attendant = attendance.attendantId;
      if (attendant.userId) {
        attendantName = attendant.userId.name || attendant.name;
      } else {
        attendantName = attendant.name;
      }
    }

    // Create transaction
    const transaction = await createCashTransactionService({
      ...validated.data,
      grid: product.grid || 0,
      plusDiscount: product.discount || 0,
      productName: product.name,
      status: "completed",
      dispenserId: dispenser._id.toString(),
      attendanceId: attendance._id.toString(),
      completedById: session.user.id,
      completedAt: new Date(),
      balanceBefore: meterBefore,
      balanceAfter: meterAfter,
    });

    // Update tanker stock
    await updateTankerStockService(tanker._id.toString(), tankerAfterStock);

    // Update dispenser total dispensed (meter reading)
    await updateDispenserTotalService(dispenser._id.toString(), meterAfter);

    // Create tanker transaction record
    await createTankerTransactionService({
      tankerId: tanker._id.toString(),
      type: "TRANSFER_OUT",
      quantity: validated.data.litresPurchased,
      beforeStock: tankerBeforeStock,
      afterStock: tankerAfterStock,
      details: {
        dispenserId: dispenser._id.toString(),
        dispenserName: dispenser.name,
        cashTransactionId: transaction._id.toString(),
        customerName: validated.data.companyName,
        plateNumber: validated.data.plateNumber,
        transactionType: "CASH_SALE",
        attendantName: attendantName,
      },
      timestamp: new Date(),
    });

    // Create dispenser usage record
    await createDispenserUsageService({
      dispenserId: dispenser._id.toString(),
      litresDispensed: validated.data.litresPurchased,
      timestamp: new Date(),
      cashTransactionId: transaction._id.toString(),
      attendanceId: attendance._id.toString(),
      balanceBefore: meterBefore,
      balanceAfter: meterAfter,
      type: "SALE",
      metadata: {
        companyName: validated.data.companyName,
        plateNumber: validated.data.plateNumber,
        driverName: validated.data.driverName,
        tankerId: tanker._id.toString(),
        tankerName: tanker.name,
        attendantName: attendantName,
      },
    });

    // Update attendance total dispensed
    await updateAttendanceTotalService(
      attendance._id.toString(),
      validated.data.litresPurchased,
    );
  } catch (error: any) {
    console.error("❌ createCashTransactionAction error:", error);
    return {
      message: "Failed to create transaction",
      errors: { global: [error.message] },
      success: false,
    };
  }

  revalidatePath("/cash-transactions");
  redirect("/cash-transactions");
}
