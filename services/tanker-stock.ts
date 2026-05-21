import { connectDB } from "@/lib/db";
import Tanker from "@/models/tanker";
import TankerRestock from "@/models/tanker-restock";
import TankerTransaction from "@/models/tanker-transaction";
import { Types } from "mongoose";

export async function getTankerStockHistoryService(tankerId: string) {
  await connectDB();

  return await TankerRestock.find({ tankerId: new Types.ObjectId(tankerId) })
    .sort({ restockDate: -1 })
    .lean();
}

export async function getTankerStockAnalyticsService(tankerId: string) {
  await connectDB();

  const records = await TankerRestock.find({
    tankerId: new Types.ObjectId(tankerId),
  }).lean();

  const totalRestocks = records.length;
  const totalReceived = records.reduce(
    (sum, r) => sum + (r.quantityAdded || 0),
    0,
  );

  return {
    totalRestocks,
    totalReceived,
  };
}

export async function restockTankerService(
  tankerId: string,
  quantityAdded: number,
  supplierName?: string,
  invoiceNumber?: string,
  notes?: string,
  restockDate?: Date,
) {
  await connectDB();

  // Get tanker
  const tanker = await Tanker.findById(tankerId);
  if (!tanker) {
    throw new Error("Tanker not found");
  }

  const beforeStock = tanker.stockLevel;

  // Update tanker stock
  tanker.stockLevel += quantityAdded;
  await tanker.save();

  // Record restock
  await TankerRestock.create({
    tankerId: new Types.ObjectId(tankerId),
    quantityAdded,
    beforeStock,
    afterStock: tanker.stockLevel,
    supplierName: supplierName || undefined,
    invoiceNumber: invoiceNumber || undefined,
    notes: notes || undefined,
    restockDate: restockDate || new Date(),
    status: "completed",
  });

  // Record transaction
  await TankerTransaction.create({
    tankerId: new Types.ObjectId(tankerId),
    type: "RESTOCK",
    quantity: quantityAdded,
    beforeStock,
    afterStock: tanker.stockLevel,
    details: {
      supplierName: supplierName || undefined,
      invoiceNumber: invoiceNumber || undefined,
      notes: notes || undefined,
    },
    timestamp: new Date(),
  });

  return tanker;
}
