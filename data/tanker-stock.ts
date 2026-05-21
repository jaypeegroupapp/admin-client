"use server";

import {
  getTankerStockHistoryService,
  getTankerStockAnalyticsService,
} from "@/services/tanker-stock";

export async function getTankerStockHistory(tankerId: string) {
  try {
    const records = await getTankerStockHistoryService(tankerId);

    const mappedRecords = records.map((record: any) => ({
      id: record._id.toString(),
      quantityAdded: record.quantityAdded,
      beforeStock: record.beforeStock,
      afterStock: record.afterStock,
      supplierName: record.supplierName,
      invoiceNumber: record.invoiceNumber,
      notes: record.notes,
      status: record.status || "completed",
      restockDate: record.restockDate || record.createdAt,
      createdAt: record.createdAt,
    }));

    return mappedRecords;
  } catch (error: any) {
    console.error("❌ getTankerStockHistory error:", error);
    return [];
  }
}

export async function getTankerStockAnalytics(tankerId: string) {
  try {
    return await getTankerStockAnalyticsService(tankerId);
  } catch (error: any) {
    console.error("❌ getTankerStockAnalytics error:", error);
    return null;
  }
}
