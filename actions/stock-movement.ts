"use server";

import { stockFormSchema } from "@/validations/stock-movement";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getProductByIdService,
  createStockMovementService,
  updateProductGridService,
} from "@/services/stock-movement";
import { addStockService, removeStockService } from "@/services/stock-movement";
import { ADDEDSTOCK } from "@/constants/stock-movement";
import { createSupplierInvoiceService } from "@/services/supplier-invoice";
import { getSupplierInvoiceByInvoiceNumber } from "@/data/supplier-invoice";

export async function createStockMovementAction(
  productId: string,
  type: string,
  reason: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const validated = stockFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const {
      quantity,
      gridAtPurchase,
      discount,
      supplierName,
      invoiceNumber,
      invoiceUnitPrice,
      invoiceDate,
    } = validated.data;

    // Ensure product exists
    const product = await getProductByIdService(productId);
    if (!product) {
      return {
        message: "Product not found",
        errors: { global: "Invalid product ID" },
      };
    }
    const invoice = await getSupplierInvoiceByInvoiceNumber(invoiceNumber);
    if (type === ADDEDSTOCK && invoice) {
      // If adding stock, ensure invoice number is unique
      return {
        message: "Invoice number already exists",
        errors: { invoiceNumber: ["This invoice number is already in use"] },
      };
    }

    // --- Handle movement types ---
    if (type === ADDEDSTOCK) {
      // Update product stock
      await addStockService(productId, {
        quantity: parseFloat(quantity),
        grid: parseFloat(gridAtPurchase),
        discount: parseFloat(discount),
      });
    }

    if (type === "OUT") {
      await removeStockService(productId, parseFloat(quantity));
    }

    // Record movement for history / accounting
    const stockMovement = await createStockMovementService(productId, {
      quantity,
      gridAtPurchase,
      discount,
      reason,
      type,
    });

    if (type === ADDEDSTOCK) {
      //create Supplier
      await createSupplierInvoiceService({
        name: supplierName,
        invoiceNumber,
        invoiceUnitPrice: parseFloat(invoiceUnitPrice),
        discount: parseFloat(discount),
        invoiceDate,
        stockMovementId: stockMovement._id.toString(),
      });
    }
  } catch (error: any) {
    console.error("❌ createStockMovementAction error:", error);
    return {
      message: "Failed to process stock movement",
      errors: { global: error.message },
    };
  }

  const url = `/products/${productId}`;
  revalidatePath(url);
  redirect(url);
}
