export interface IOrderItem {
  id?: string;
  orderId: string;
  truckId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
