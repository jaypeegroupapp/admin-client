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
    companyName: String;
    plateNumber: String;
    driverName: String;
    tankerId: String; // Add this
    tankerName: String; // Add this
    attendantName: String; // Add this
  };
  createdAt?: string;
  updatedAt?: string;
}
