import { Types } from "mongoose";

export interface IDispenserUsage {
  id?: string;
  dispenserId: Types.ObjectId | string;
  litresDispensed: number;
  timestamp: Date;

  // Related entities
  orderId?: Types.ObjectId | string;
  orderItemId?: Types.ObjectId | string;
  cashTransactionId?: Types.ObjectId | string; // Add this for cash transactions
  attendanceId?: Types.ObjectId | string;

  // Balance tracking
  balanceBefore?: number;
  balanceAfter?: number;

  // Type of transaction
  type: "SALE" | "STOCK_IN" | "ADJUSTMENT";

  // Metadata for additional context
  metadata?: {
    companyName?: string;
    plateNumber?: string;
    driverName?: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
