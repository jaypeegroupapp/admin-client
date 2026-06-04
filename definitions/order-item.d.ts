import { Types } from "mongoose";

export interface IOrderItem {
  id?: string;
  orderId: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  truckId: Types.ObjectId | string;
  quantity: number;
  price: number;
  status: "pending" | "accepted" | "completed" | "cancelled";
  signature?: string;
  dispenserId?: Types.ObjectId | string; // Add this
  attendanceId?: Types.ObjectId | string; // Add this
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItemAggregated {
  id: string;
  orderId: string;
  orderNumber?: string;
  productId: string;
  productName?: string;
  companyId: string;
  companyName?: string;
  truckId: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  quantity: number;
  status: "pending" | "accepted" | "completed" | "cancelled";
  signature?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;

  // Dispenser and fulfillment info
  dispenserId?: string;
  dispenserName?: string;
  attendanceId?: string;
  attendantName?: string;
  meterReading?: number;
  tankerStockLevel?: number;
  tankerName?: string;

  // Metadata
  metadata?: {
    tankerName?: string;
    tankerId?: string;
    attendantName?: string;
  };
}
export type OrderItemTab =
  | "All"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";
