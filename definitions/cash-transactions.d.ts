// src/definitions/cash-transactions.ts
export interface ICashTransaction {
  id?: string;
  companyName: string;
  plateNumber: string;
  litresPurchased: number;
  driverName: string;
  phoneNumber: string;
  productId: string;
  productName: string;
  grid: number;
  plusDiscount: number;
  total?: number;
  status?: "pending" | "completed" | "cancelled";
  
  // Dispenser tracking
  dispenserId?: string;
  attendanceId?: string;
  completedById?: string;
  completedAt?: string;
  signature?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  
  createdAt?: string;
  updatedAt?: string;
}

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
  dispenserName?: string;
  attendantName?: string;
}

export type CashTransactionTab = "All" | "Pending" | "Completed" | "Cancelled";