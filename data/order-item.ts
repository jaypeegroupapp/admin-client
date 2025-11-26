import {
  getOrderItemsByOrderIdService,
  getTotalQuantityForProductService,
} from "@/services/order-item";

export async function getOrderItemsByOrderId(orderId: string) {
  try {
    const items = await getOrderItemsByOrderIdService(orderId);
    return items.map((i: any) => ({
      id: i._id.toString(),
      truckId: i.truckId?._id || "",
      truckPlate: i.truckId?.plateNumber || "",
      quantity: i.quantity,
    }));
  } catch (err) {
    console.error("❌ getOrderItemsByOrderId error:", err);
    return [];
  }
}

export async function getTotalQuantityForProduct(productId: string) {
  try {
    return await getTotalQuantityForProductService(productId);
  } catch (err) {
    console.error("❌ getOrderItemsByOrderId error:", err);
    return 0;
  }
}
