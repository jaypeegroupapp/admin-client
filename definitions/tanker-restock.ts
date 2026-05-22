import mongoose from "mongoose";

export interface ITankerRestock {
  tankerId: mongoose.Types.ObjectId;
  quantityAdded: number;
  beforeStock: number;
  afterStock: number;
  expectedClosingBalance: number;
  actualMeterReading: number;
  variance: number;
  variancePercentage: number;
  status: "completed" | "discrepancy";

  // Supplier invoice details
  supplierName?: string;
  invoiceNumber?: string;
  invoiceUnitPrice?: number;
  invoiceDate?: Date;

  // Pricing details
  gridAtPurchase?: number;
  discount: number;

  // Other fields
  notes?: string;
  restockDate: Date;
  recordedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
