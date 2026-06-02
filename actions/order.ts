"use server";

import { completeMineOrderWithInvoice } from "@/services/mine-invoice";
import { completeOrderWithInvoice } from "@/services/company-invoice";
import { acceptOrderService, declineOrderService } from "@/services/order";
import { revalidatePath } from "next/cache";

// ---------------- ACCEPT ORDER ----------------
export async function acceptOrderAction(orderId: string, quantity: number) {
  try {
    await acceptOrderService(orderId, quantity);

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, message: "Order accepted successfully" };
  } catch (error: any) {
    console.error("❌ acceptOrderAction error:", error);
    return {
      success: false,
      message: error.message || "Failed to accept order.",
    };
  }
}

export async function declineOrderAction(orderId: string, reason: string) {
  try {
    const order = await declineOrderService(orderId, reason);

    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/orders");

    return { success: true, message: "Order declined successfully" };
  } catch (error: any) {
    console.error("❌ declineOrderAction error:", error);
    return {
      success: false,
      message: error.message || "Failed to decline order.",
    };
  }
}
// /actions/order.ts
export async function completeOrderAction(orderId: string) {
  try {
    const result = await completeOrderWithInvoice(orderId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ completeOrderAction error:", error);
    return { success: false, message: "Failed to complete order." };
  }
}

export async function completeMineOrderAction(orderId: string) {
  try {
    const result = await completeMineOrderWithInvoice(orderId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ completeOrderAction error:", error);
    return { success: false, message: "Failed to complete order." };
  }
}

// /actions/order.ts
export async function completeOrderWithSiignatureAction(
  orderId: string,
  signature: string,
) {
  try {
    const result = await completeOrderWithInvoice(orderId);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ completeOrderAction error:", error);
    return { success: false, message: "Failed to complete order." };
  }
}
