export interface IOrder {
  id?: string;
  userId: string;
  companyId: string;
  productId: string;
  productName: string;
  totalAmount: number;
  collectionDate: string;
  status: string;
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
