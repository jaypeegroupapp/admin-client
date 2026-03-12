// src/services/dispenser-stock.ts
import mongoose from "mongoose";
import DispenserStockRecord from "@/models/dispenser-stock-record";
import Dispenser from "@/models/dispenser";
import { getSupplierInvoiceByInvoiceNumberService } from "@/services/supplier-invoice";
import { connectDB } from "@/lib/db";

export interface FillDispenserInput {
  dispenserId: string;
  purchasedQuantity: number;
  actualMeterReading: number;

  // Supplier invoice fields (from your stock movement)
  supplierName?: string;
  invoiceNumber?: string;
  invoiceUnitPrice?: number;
  invoiceDate?: string;

  // Pricing fields
  gridAtPurchase?: number;
  discount?: number;

  purchaseId?: string;
  recordedBy?: string;
  notes?: string;
  fillDate?: Date;
}

export async function getCurrentDispenserBalance(
  dispenserId: string,
): Promise<number> {
  await connectDB();

  const latestRecord = (await DispenserStockRecord.findOne({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  })
    .sort({ fillDate: -1 })
    .lean()) as any;

  if (!latestRecord) {
    const dispenser = (await Dispenser.findById(dispenserId).lean()) as any;
    return dispenser?.litres || 0;
  }

  return latestRecord.actualMeterReading;
}

export async function validateInvoiceNumber(
  invoiceNumber: string,
  dispenserId: string,
): Promise<boolean> {
  await connectDB();

  // Check if invoice already used for this dispenser
  const existingRecord = await DispenserStockRecord.findOne({
    invoiceNumber,
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  }).lean();

  if (existingRecord) {
    throw new Error(
      `Invoice number ${invoiceNumber} already used for this dispenser`,
    );
  }

  // Also check in supplier invoices if needed
  const existingInvoice =
    await getSupplierInvoiceByInvoiceNumberService(invoiceNumber);
  if (existingInvoice) {
    throw new Error(`Invoice number ${invoiceNumber} already exists in system`);
  }

  return true;
}

export async function recordDispenserFill(input: FillDispenserInput) {
  await connectDB();

  const {
    dispenserId,
    purchasedQuantity,
    actualMeterReading,
    supplierName,
    invoiceNumber,
    invoiceUnitPrice,
    invoiceDate,
    gridAtPurchase,
    discount = 0,
    purchaseId,
    recordedBy,
    notes,
    fillDate = new Date(),
  } = input;

  // Validate invoice number if provided
  if (invoiceNumber) {
    await validateInvoiceNumber(invoiceNumber, dispenserId);
  }

  // Get opening balance
  const openingBalance = await getCurrentDispenserBalance(dispenserId);

  // Calculate expected closing balance
  const expectedClosingBalance = openingBalance + purchasedQuantity;

  // Calculate variance
  const variance = actualMeterReading - expectedClosingBalance;
  const variancePercentage =
    expectedClosingBalance > 0 ? (variance / expectedClosingBalance) * 100 : 0;

  // Determine status (5% tolerance)
  const tolerance = 5;
  const status =
    Math.abs(variancePercentage) <= tolerance ? "completed" : "discrepancy";

  // Create stock record with all purchase details
  const stockRecord = await DispenserStockRecord.create({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
    openingBalance,
    purchaseId: purchaseId
      ? new mongoose.Types.ObjectId(purchaseId)
      : undefined,
    purchasedQuantity,

    // Supplier invoice details
    supplierName,
    invoiceNumber,
    invoiceUnitPrice: invoiceUnitPrice ? Number(invoiceUnitPrice) : undefined,
    invoiceDate: invoiceDate ? new Date(invoiceDate) : undefined,

    // Pricing details
    gridAtPurchase: gridAtPurchase ? Number(gridAtPurchase) : undefined,
    discount: Number(discount),

    expectedClosingBalance,
    actualMeterReading,
    variance,
    variancePercentage,
    status,
    fillDate,
    recordedBy: recordedBy
      ? new mongoose.Types.ObjectId(recordedBy)
      : undefined,
    notes,
  });

  // Update dispenser's current litres
  await Dispenser.findByIdAndUpdate(dispenserId, {
    litres: actualMeterReading,
  });

  return stockRecord;
}

export async function getDispenserStockHistory(dispenserId: string) {
  await connectDB();

  const records = await DispenserStockRecord.find({
    dispenserId: new mongoose.Types.ObjectId(dispenserId),
  })
    .populate("purchaseId")
    .populate("recordedBy", "name email")
    .sort({ fillDate: -1 })
    .lean();

  return records;
}

export async function getDispenserStockAnalytics(dispenserId: string) {
  await connectDB();

  const analytics = await DispenserStockRecord.aggregate([
    {
      $match: {
        dispenserId: new mongoose.Types.ObjectId(dispenserId),
      },
    },
    {
      $group: {
        _id: null,
        totalFills: { $sum: 1 },
        totalPurchased: { $sum: "$purchasedQuantity" },
        totalSpent: {
          $sum: {
            $multiply: [
              "$purchasedQuantity",
              { $ifNull: ["$invoiceUnitPrice", 0] },
            ],
          },
        },
        totalVariance: { $sum: "$variance" },
        avgVariance: { $avg: "$variance" },
        avgVariancePercentage: { $avg: "$variancePercentage" },
        discrepancyCount: {
          $sum: { $cond: [{ $eq: ["$status", "discrepancy"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    analytics[0] || {
      totalFills: 0,
      totalPurchased: 0,
      totalSpent: 0,
      totalVariance: 0,
      avgVariance: 0,
      avgVariancePercentage: 0,
      discrepancyCount: 0,
    }
  );
}

export async function getSupplierInvoiceStats(dispenserId: string) {
  await connectDB();

  const stats = await DispenserStockRecord.aggregate([
    {
      $match: {
        dispenserId: new mongoose.Types.ObjectId(dispenserId),
        invoiceNumber: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        uniqueSuppliers: { $addToSet: "$supplierName" },
        avgUnitPrice: { $avg: "$invoiceUnitPrice" },
        totalDiscount: { $sum: "$discount" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalInvoices: 0,
      uniqueSuppliers: [],
      avgUnitPrice: 0,
      totalDiscount: 0,
    }
  );
}

/**
 * Update dispenser stock after a sale
 */
export async function updateDispenserStockService(
  dispenserId: string,
  newStockLevel: number,
) {
  await connectDB();

  const result = await Dispenser.findByIdAndUpdate(
    dispenserId,
    {
      litres: newStockLevel,
      lastReading: newStockLevel,
      lastReadingDate: new Date(),
    },
    { new: true },
  );

  return result;
}
