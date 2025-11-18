export interface IStockMovement extends Document {
  id?: string;
  productId: Types.ObjectId;
  type: "IN" | "OUT";
  quantity: number;
  purchasedPrice: number;
  sellingPriceAtPurchase: number;
  reason?: string;
  createdAt?: Date;
}
