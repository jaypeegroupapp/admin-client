"use server";

import {
  getTankerSpillageRecordsService,
  getTankerSpillageAnalyticsService,
} from "@/services/tanker-spillage";

export async function getTankerSpillageRecords(tankerId: string) {
  try {
    const records = await getTankerSpillageRecordsService(tankerId);

    const mappedRecords = records.map((record: any) => ({
      id: record._id.toString(),
      quantity: record.quantity,
      type: record.type,
      reason: record.reason,
      estimatedCost: record.estimatedCost,
      notes: record.notes,
      spillageDate: record.spillageDate || record.createdAt,
      createdAt: record.createdAt,
    }));

    return mappedRecords;
  } catch (error: any) {
    console.error("❌ getTankerSpillageRecords error:", error);
    return [];
  }
}

export async function getTankerSpillageAnalytics(tankerId: string) {
  try {
    return await getTankerSpillageAnalyticsService(tankerId);
  } catch (error: any) {
    console.error("❌ getTankerSpillageAnalytics error:", error);
    return null;
  }
}
