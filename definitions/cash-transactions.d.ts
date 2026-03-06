import { Types } from "mongoose";

export type CashTransactionTab = "All" | "Pending" | "Completed" | "Cancelled";

export interface ICashTransactionAggregated {
  id: string;
  companyName: string;
  productName: string;
  plateNumber: string;
  driverName: string;
  phoneNumber: string;
  grid: number;
  plusDiscount: number;

  litres: number;
  total: number;

  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface ICashTransaction {
  id?: string;

  companyName: string;
  plateNumber: string;

  litresPurchased: number;

  driverName: string;
  phoneNumber: string;

  grid: number;
  plusDiscount: number;

  total?: number;

  status?: "pending" | "completed" | "cancelled";

  createdAt?: string;
  updatedAt?: string;
}
