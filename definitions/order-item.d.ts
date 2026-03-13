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
  productId?: string;
  companyId?: string;
  quantity: number;
  status: string;
  signature?: string | undefined;
  truckId: string;
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  companyName?: string;
  productName?: string;
}

export type OrderItemTab =
  | "All"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";
