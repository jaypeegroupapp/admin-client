export interface IDispenserStockRecord {
  id?: string;
  dispenserId: Types.ObjectId | string;

  // Opening balance (before filling)
  openingBalance: number; // litres left in dispenser

  // Purchase details (from your stock movement system)
  purchaseId?: Types.ObjectId | string; // reference to SupplierInvoice
  purchasedQuantity: number; // litres purchased to fill

  // Supplier invoice details (embedded for quick access)
  supplierName?: string;
  invoiceNumber?: string;
  invoiceUnitPrice?: number;
  invoiceDate?: Date;

  // Pricing details
  gridAtPurchase?: number; // selling price at time of purchase
  discount?: number; // discount applied

  // Expected closing balance (opening + purchased)
  expectedClosingBalance: number;

  // Actual meter reading
  actualMeterReading: number; // actual litres according to dispenser meter

  // Variance calculation
  variance: number; // actual - expected (positive = over, negative = under)
  variancePercentage: number; // (variance / expected) * 100

  // Status
  status: "pending" | "completed" | "discrepancy"; // if variance > threshold

  // Timestamps
  fillDate: Date;
  recordedBy?: Types.ObjectId | string;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}

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
