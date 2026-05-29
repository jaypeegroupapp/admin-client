"use server";

import { completeOrderItem } from "@/services/order-item";
import { revalidatePath } from "next/cache";

export async function completeOrderItemAction(
  itemId: string,
  signature?: string,
) {
  try {
    const result = await completeOrderItem(itemId, signature);
    if (!result.success) {
      return { success: false, message: result.message };
    }

    // revalidatePath("/truck-orders");

    return {
      success: true,
      message: "Order completed successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("❌ completeOrderItemAction error:", error);
    return { success: false, message: "Failed to complete order item." };
  }
}
