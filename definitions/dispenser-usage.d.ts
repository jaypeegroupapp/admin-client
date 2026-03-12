import { Types } from "mongoose";

export interface IDispenserUsage {
  id?: string;
  dispenserId: Types.ObjectId | string;
  litresDispensed: number;
  timestamp: Date;
  orderId?: Types.ObjectId | string;
  orderItemId?: Types.ObjectId | string; // Add this
  attendanceId?: Types.ObjectId | string; // Add this
  balanceBefore?: number; // Add this for audit trail
  balanceAfter?: number; // Add this for audit trail
  createdAt?: string;
  updatedAt?: string;
}
