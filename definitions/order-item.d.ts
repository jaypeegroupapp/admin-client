export interface IOrderItem {
  id?: string;
  orderId: string;
  truckId: string;
  quantity: number;
  signature?: string;
  status: "pending" | "completed" | "restock" | "cancelled";
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
