import { connectDB } from "@/lib/db";
import Tanker from "@/models/tanker";
import TankerSpillage from "@/models/tanker-spillage";
import TankerTransaction from "@/models/tanker-transaction";
import { Types } from "mongoose";

export async function getTankerSpillageRecordsService(tankerId: string) {
  await connectDB();

  return await TankerSpillage.find({ tankerId: new Types.ObjectId(tankerId) })
    .sort({ spillageDate: -1 })
    .lean();
}

export async function getTankerSpillageAnalyticsService(tankerId: string) {
  await connectDB();

  const records = await TankerSpillage.find({
    tankerId: new Types.ObjectId(tankerId),
  }).lean();

  const totalSpillage = records.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalEvents = records.length;
  const totalCost = records.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);

  // Find most common spillage type
  const typeCount: Record<string, number> = {};
  records.forEach((r) => {
    typeCount[r.type] = (typeCount[r.type] || 0) + 1;
  });

  let mostCommonType = "N/A";
  let maxCount = 0;
  for (const [type, count] of Object.entries(typeCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonType = type;
    }
  }

  const typeMap: Record<string, string> = {
    TRANSFER: "Transfer Spillage",
    STORAGE: "Storage Leakage",
    HANDLING: "Handling Spillage",
  };

  return {
    totalSpillage,
    totalEvents,
    totalCost,
    mostCommonType: typeMap[mostCommonType] || mostCommonType,
  };
}

export async function recordSpillageService(
  tankerId: string,
  quantity: number,
  type: "TRANSFER" | "STORAGE" | "HANDLING",
  reason: string,
  estimatedCost?: number,
  notes?: string,
  spillageDate?: Date,
) {
  await connectDB();

  // Get tanker
  const tanker = await Tanker.findById(tankerId);
  if (!tanker) {
    throw new Error("Tanker not found");
  }

  // Check sufficient stock
  if (tanker.stockLevel < quantity) {
    throw new Error("Cannot record spillage exceeding current stock");
  }

  const beforeStock = tanker.stockLevel;

  // Deduct spillage from tanker stock
  tanker.stockLevel -= quantity;
  await tanker.save();

  // Record spillage
  await TankerSpillage.create({
    tankerId: new Types.ObjectId(tankerId),
    quantity,
    type,
    reason,
    estimatedCost,
    notes: notes || undefined,
    spillageDate: spillageDate || new Date(),
  });

  // Record transaction
  await TankerTransaction.create({
    tankerId: new Types.ObjectId(tankerId),
    type: "SPILLAGE",
    quantity,
    beforeStock,
    afterStock: tanker.stockLevel,
    details: {
      reason,
      type,
      estimatedCost,
      notes: notes || undefined,
    },
    timestamp: new Date(),
  });

  return tanker;
}
