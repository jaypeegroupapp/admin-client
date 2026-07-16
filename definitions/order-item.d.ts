import { Types } from "mongoose";

export interface IOrderItem {
  id?: string;
  orderId: Types.ObjectId | string;
  truckId: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  quantity: number;
  price: number;
  status: "pending" | "accepted" | "completed" | "cancelled" | "returned" | "closed";
  signature?: string;
  dispenserId?: Types.ObjectId | string;
  attendanceId?: Types.ObjectId | string;
  // Return fields
  isReturned?: boolean;
  returnedAt?: Date;
  returnedReason?: string;
  returnedBy?: Types.ObjectId | string;
  // Closed fields (simplified)
  closedAt?: Date;
  closedBy?: Types.ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
}

// src/definitions/order-item.ts

export interface IOrderItemAggregated {
  id: string;
  orderId: string;
  orderNumber?: string;
  productId?: string;
  productName?: string;
  companyId?: string;
  companyName?: string;
  truckId: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  quantity: number;
  status: string;
  signature?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // Return fields
  isReturned?: boolean;
  returnedAt?: string;
  returnedReason?: string;
  returnedBy?: string;

  // Closed fields (simplified)
  closedAt?: string;
  closedBy?: string;

  // Dispenser fields
  dispenserId?: string;
  dispenserName?: string;
  attendanceId?: string;
  attendantName?: string;
  meterReading?: number;
  tankerName?: string;
  tankerStockLevel?: number;
}

export type OrderItemTab =
  | "All"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";
