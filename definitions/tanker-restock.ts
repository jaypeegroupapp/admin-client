import mongoose from "mongoose";

export interface ITankerRestock {
  tankerId: mongoose.Types.ObjectId;
  quantityAdded: number;
  beforeStock: number;
  afterStock: number;
  expectedClosingBalance: number;
  actualMeterReading: number;
  meterVariance: number;
  meterVariancePercentage: number;

  // Manual dipping reading fields
  manualDippingReading: number;
  dippingVariance: number;
  dippingVariancePercentage: number;

  status: "completed" | "discrepancy";

  // Supplier invoice details (all required)
  supplierName: string;
  invoiceNumber: string;
  invoiceUnitPrice: number;
  invoiceDate: Date;

  // Pricing details (all required)
  gridAtPurchase: number;
  discount: number;

  // Other fields
  notes?: string;
  restockDate: Date;
  recordedBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
