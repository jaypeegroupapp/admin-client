export interface IStockMovement extends Document {
  id?: string;
  productId: Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  purchasePrice: number;
  gridAtPurchase: number;
  reason?: string;
  createdAt?: Date;
}
