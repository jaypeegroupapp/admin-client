"use server";

import { completeOrderWithInvoice } from "@/services/company-invoice";
import {
  acceptOrderWithTransaction,
  declineOrderService,
} from "@/services/order";

// ---------------- ACCEPT ORDER ----------------
export async function acceptOrderAction(orderId: string, quantity: number) {
  try {
    const result = await acceptOrderWithTransaction(orderId, quantity);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ acceptOrderAction error:", error);
    return { success: false, message: "Failed to accept order." };
  }
}

// /actions/order.ts
export async function completeOrderAction(orderId: string) {
  try {
    const result = await completeOrderWithInvoice(orderId);

    if (!result.success) return { success: false, message: result.message };

    return { success: true };
  } catch (error) {
    console.error("❌ completeOrderAction error:", error);
    return { success: false, message: "Failed to complete order." };
  }
}

// ---------------- DECLINE ORDER ----------------
export async function declineOrderAction(orderId: string, reason: string) {
  try {
    const order = await declineOrderService(orderId, reason);
    if (!order) return { success: false, message: "Order not found." };

    return { success: true };
  } catch (error) {
    console.error("❌ declineOrderAction error:", error);
    return { success: false, message: "Failed to decline order." };
  }
}
