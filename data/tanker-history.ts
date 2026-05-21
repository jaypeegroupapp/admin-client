"use server";

import { getTankerTransactionHistoryService } from "@/services/tanker-history";

export async function getTankerTransactionHistory(tankerId: string) {
  try {
    const transactions = await getTankerTransactionHistoryService(tankerId);

    const mappedTransactions = transactions.map((tx: any) => ({
      id: tx._id.toString(),
      type: tx.type,
      quantity: tx.quantity,
      beforeStock: tx.beforeStock,
      afterStock: tx.afterStock,
      timestamp: tx.timestamp,
      details: tx.details || {},
    }));

    return mappedTransactions;
  } catch (error: any) {
    console.error("❌ getTankerTransactionHistory error:", error);
    return [];
  }
}
