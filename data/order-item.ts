"use server";
import {
  getAllOrderItemsService,
  getOrderItemsByOrderIdService,
  getTotalQuantityForProductService,
} from "@/services/order-item";

// data/order-item.ts
import { getOrderItemsService } from "@/services/order-item";
import { orderItemMap } from "./mapper";

export async function getOrderItems(
  page = 0,
  pageSize = 12,
  search = "",
  status = "all",
  fromDate = "",
  toDate = ""
) {
  try {
    const { data, totalCount, stats } = await getOrderItemsService(
      page,
      pageSize,
      search,
      status,
      fromDate,
      toDate
    );

    return {
      data: data.map(orderItemMap),
      totalCount,
      stats,
    };
  } catch (err) {
    console.error("❌ getOrderItems error:", err);
    return { data: [], totalCount: 0, stats: {} };
  }
}

export async function getAllOrderItems() {
  try {
    const items = await getAllOrderItemsService();

    return items.map((i: any) => ({
      id: i._id,
      orderId: i.orderId,
      productId: i.productId || null,
      companyId: i.companyId || null,
      quantity: i.quantity,
      status: i.status || "pending",
      signature: i.signature || undefined,
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
