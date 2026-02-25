export interface IOrder {
  id?: string;
  userId: string;
  mineId?: string;
  mineName?: string;
  companyId: string;
  companyName?: string;
  productId?: string;
  purchasePrice?: number;
  grid?: number;
  invoiceId?: string;
  productName?: string;
  totalAmount: number;
  debit: number;
  credit: number;
  collectionDate: string;
  status: string;
  reason?: string;
  signature?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: {
    id: string;
    truckName: string;
    quantity: number;
  }[];
}

export interface CreateOrderInput {
  userId: string;
  companyId: string;
  productId: string;
  totalAmount: number;
  collectionDate: string;
  status?: string;
  items: {
    truckId: string;
    quantity: number;
  }[];
}

export type OrderTab =
  | "All"
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled";
