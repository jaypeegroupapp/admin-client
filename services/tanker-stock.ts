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
  const totalCost = records.reduce(
    (sum, r) => sum + r.quantityAdded * (r.invoiceUnitPrice || 0),
    0,
  );
  const totalDiscount = records.reduce((sum, r) => sum + (r.discount || 0), 0);

  return {
    totalRestocks,
    totalReceived,
    totalCost,
    totalDiscount,
  };
}

export async function restockTankerService(
  tankerId: string,
  quantityAdded: number,
  actualMeterReading: number,
  beforeStock?: number,
  supplierName?: string,
  invoiceNumber?: string,
  invoiceUnitPrice?: number,
  invoiceDate?: Date,
  gridAtPurchase?: number,
  discount?: number,
  notes?: string,
  restockDate?: Date,
) {
  await connectDB();

  // Get tanker
  const tanker = await Tanker.findById(tankerId);
  if (!tanker) {
    throw new Error("Tanker not found");
  }

  const openingBalance =
    beforeStock !== undefined ? beforeStock : tanker.stockLevel;
  const expectedClosingBalance = openingBalance + quantityAdded;

  // Check capacity
  if (expectedClosingBalance > tanker.capacity) {
    throw new Error(
      `Restock would exceed tanker capacity of ${tanker.capacity}L. Expected: ${expectedClosingBalance}L`,
    );
  }

  // Calculate variance
  const variance = actualMeterReading - expectedClosingBalance;
  const variancePercentage =
    expectedClosingBalance > 0 ? (variance / expectedClosingBalance) * 100 : 0;

  // Determine status (5% tolerance)
  const tolerance = 5;
  const status =
    Math.abs(variancePercentage) <= tolerance ? "completed" : "discrepancy";

  // Update tanker stock with actual meter reading
  tanker.stockLevel = actualMeterReading;
  await tanker.save();

  // Calculate financial metrics
  const totalCost = quantityAdded * (invoiceUnitPrice || 0);
  const discountedTotal = discount
    ? totalCost * (1 - discount / 100)
    : totalCost;
  const potentialRevenue = quantityAdded * (gridAtPurchase || 0);
  const profit = potentialRevenue - discountedTotal;

  // Record restock with all details
  await TankerRestock.create({
    tankerId: new Types.ObjectId(tankerId),
    quantityAdded,
    beforeStock: openingBalance,
    afterStock: actualMeterReading,
    expectedClosingBalance,
    actualMeterReading,
    variance,
    variancePercentage,
    status,
    supplierName: supplierName || undefined,
    invoiceNumber: invoiceNumber || undefined,
    invoiceUnitPrice: invoiceUnitPrice || undefined,
    invoiceDate: invoiceDate || undefined,
    gridAtPurchase: gridAtPurchase || undefined,
    discount: discount || 0,
    notes: notes || undefined,
    restockDate: restockDate || new Date(),
  });

  // Record transaction with details
  await TankerTransaction.create({
    tankerId: new Types.ObjectId(tankerId),
    type: "RESTOCK",
    quantity: quantityAdded,
    beforeStock: openingBalance,
    afterStock: actualMeterReading,
    details: {
      expectedClosingBalance,
      actualMeterReading,
      variance,
      variancePercentage,
      status,
      supplierName: supplierName || undefined,
      invoiceNumber: invoiceNumber || undefined,
      invoiceUnitPrice: invoiceUnitPrice || undefined,
      invoiceDate: invoiceDate || undefined,
      gridAtPurchase: gridAtPurchase || undefined,
      discount: discount || 0,
      totalCost: discountedTotal,
      potentialRevenue,
      profit,
      notes: notes || undefined,
    },
    timestamp: new Date(),
  });

  return tanker;
}

export async function validateTankerInvoiceNumber(
  invoiceNumber: string,
  tankerId: string,
): Promise<boolean> {
  await connectDB();

  const existingRecord = await TankerRestock.findOne({
    invoiceNumber,
    tankerId: new Types.ObjectId(tankerId),
  }).lean();

  if (existingRecord) {
    throw new Error(
      `Invoice number ${invoiceNumber} already used for this tanker`,
    );
  }

  return true;
}
