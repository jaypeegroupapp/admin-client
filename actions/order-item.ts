"use server";

import { closeReturnService, completeOrderItem } from "@/services/order-item";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";

export async function completeOrderItemAction(
  itemId: string,
  signature?: string,
) {
  try {
    const result = await completeOrderItem(itemId, signature);
    if (!result.success) {
      return { success: false, message: result.message };
    }

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

export async function closeReturnAction(itemId: string) {
  try {
    const session = await verifySession();
    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.userId as string;
    const result = await closeReturnService(itemId, userId);

    if (result.success) {
      revalidatePath("/refunds");
    }

    return result;
  } catch (error: any) {
    console.error("❌ closeReturnAction error:", error);
    return { success: false, message: error.message };
  }
}
