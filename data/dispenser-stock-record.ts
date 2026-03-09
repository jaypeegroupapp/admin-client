// src/data/dispenser-stock.ts
"use server";

import {
  getDispenserStockHistory as getStockHistoryService,
  getDispenserStockAnalytics as getStockAnalyticsService,
  getCurrentDispenserBalance,
} from "@/services/dispenser-stock-record";

export async function getDispenserStockHistory(dispenserId: string) {
  try {
    const records = await getStockHistoryService(dispenserId);
    return records.map(mapDispenserStockRecord);
  } catch (error) {
    console.error("❌ getDispenserStockHistory error:", error);
    return [];
  }
}

export async function getDispenserStockAnalytics(dispenserId: string) {
  try {
    return await getStockAnalyticsService(dispenserId);
  } catch (error) {
    console.error("❌ getDispenserStockAnalytics error:", error);
    return null;
  }
}

export async function getCurrentBalance(dispenserId: string) {
  try {
    return await getCurrentDispenserBalance(dispenserId);
  } catch (error) {
    console.error("❌ getCurrentBalance error:", error);
    return 0;
  }
}

function mapDispenserStockRecord(doc: any): any {
  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    openingBalance: doc.openingBalance,
    purchaseId: doc.purchaseId?._id?.toString() || doc.purchaseId?.toString(),
    purchasedQuantity: doc.purchasedQuantity,
    expectedClosingBalance: doc.expectedClosingBalance,
    actualMeterReading: doc.actualMeterReading,
    variance: doc.variance,
    variancePercentage: doc.variancePercentage,
    status: doc.status,
    fillDate: doc.fillDate?.toISOString(),
    recordedBy: doc.recordedBy?._id?.toString() || doc.recordedBy?.toString(),
    notes: doc.notes,
    createdAt: doc.createdAt?.toISOString(),
  };
}
