"use server";

import { stockFormSchema } from "@/validations/stock-movement";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getProductByIdService,
  createStockMovementService,
  updateProductSellingPriceService,
} from "@/services/stock-movement";
import { addStockService, removeStockService } from "@/services/stock-movement";
import { ADDEDSTOCK } from "@/constants/stock-movement";
import { createSupplierInvoiceService } from "@/services/supplier-invoice";

export async function createStockMovementAction(
  productId: string,
  type: string,
  reason: string,
  prevState: any,
  formData: FormData
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
      purchasePrice,
      sellingPriceAtPurchase,
      supplierName,
      invoiceNumber,
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

    // --- Handle movement types ---
    if (type === ADDEDSTOCK) {
      // Update product stock
      await addStockService(productId, {
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPriceAtPurchase),
      });
    }

    if (type === "OUT") {
      await removeStockService(productId, parseFloat(quantity));
    }

    // Record movement for history / accounting
    const stockMovement = await createStockMovementService(productId, {
      quantity,
      purchasePrice,
      sellingPriceAtPurchase,
      reason,
      type,
    });

    if (type === ADDEDSTOCK) {
      //create Supplier
      await createSupplierInvoiceService({
        name: supplierName,
        invoiceNumber,
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
