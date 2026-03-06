// src/data/dispenser-usage.ts
"use server";
import {
  getDispenserUsageHistoryService,
  getTotalDispenserUsageService,
} from "@/services/dispenser-usage";

export async function getTotalDispenserUsage(dispenserId: string) {
  try {
    return await getTotalDispenserUsageService(dispenserId);
  } catch (err) {
    console.error("❌ getTotalDispenserUsage error:", err);
    return 0;
  }
}

export async function getDispenserUsageHistory(dispenserId: string) {
  try {
    const usage = await getDispenserUsageHistoryService(dispenserId);
    return Array.isArray(usage) ? usage.map(mapDispenserUsage) : [];
  } catch (err) {
    console.error("❌ getDispenserUsageHistory error:", err);
    return [];
  }
}

function mapDispenserUsage(doc: any): any {
  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    litresDispensed: doc.litresDispensed,
    timestamp: doc.timestamp?.toISOString(),
    orderId: doc.orderId?.toString(),
    createdAt: doc.createdAt?.toISOString(),
  };
}
