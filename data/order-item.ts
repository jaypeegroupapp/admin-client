"use server";
import {
  getAllOrderItemsService,
  getOrderItemsByOrderIdService,
  getTotalQuantityForProductService,
} from "@/services/order-item";

export async function getAllOrderItems() {
  try {
    const items = await getAllOrderItemsService();

    return items.map((i: any) => ({
      id: i._id,
      orderId: i.orderId,
      productId: i.productId || null,
      companyId: i.companyId || null,
      quantity: i.quantity,
      status: i.status,
      signature: i.signature || null,
      /** TRUCK DETAILS */
      truckId: i.truckId,
      plateNumber: i.plateNumber,
      make: i.make,
      model: i.model,
      year: i.year,
      /** COMPANY */
      companyName: i.companyName || null,
      /** PRODUCT */
      productName: i.productName || null,
    }));
  } catch (err) {
    console.error("❌ getAllOrderItems error:", err);
    return [];
  }
}

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
