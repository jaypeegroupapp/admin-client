import mongoose from "mongoose";

export interface ITankerRestock {
  tankerId: mongoose.Types.ObjectId;
  quantityAdded: number;
  beforeStock: number;
  afterStock: number;

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
  status: "pending" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
