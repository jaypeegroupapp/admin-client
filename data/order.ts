import {
  getOrdersService,
  getOrderByIdService,
  getOrdersByCompanyIdService,
  getOrdersByProductIdService,
  getInvoiceOrdersService,
  getOrdersByMineService,
  getMineInvoiceOrdersService,
  getAvailableStockForProductService,
} from "@/services/order";
import { mapOrder } from "./mapper";

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrders(
  page = 0,
  pageSize = 12,
  search = "",
  status = "All",
  fromDate = "",
  toDate = "",
) {
  try {
    const { data, totalCount, stats } = await getOrdersService(
      page,
      pageSize,
      search,
      status,
      fromDate,
      toDate,
    );

    return {
      data: Array.isArray(data) ? data.map(mapOrder) : [],
      totalCount,
      stats,
    };
  } catch (err) {
    console.error("❌ getOrders error:", err);
    return { data: [], totalCount: 0, stats: {} };
  }
}

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrdersByCompanyId(companyId: string) {
  try {
    const orders = await getOrdersByCompanyIdService(companyId);

    return Array.isArray(orders) ? orders.map(mapOrder) : [];
  } catch (err) {
    console.error("❌ getOrders error:", err);
    return [];
  }
}

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrdersByMine(mineId: string) {
  try {
    const orders = await getOrdersByMineService(mineId);
    return Array.isArray(orders) ? orders.map(mapOrder) : [];
  } catch (err) {
    console.error("❌ getOrdersByMine error:", err);
    return [];
  }
}

/**
 * 🧩 Fetch a single order by ID and map to UI-friendly format
 */
/**
 * 🧠 Wrapper for server-safe access (used in actions or routes)
 */
// src/data/order.ts
// src/data/order.ts

export async function getOrderById(id: string) {
  try {
    const order = (await getOrderByIdService(id)) as any;
    if (!order) return null;

    const items = order.items.map((item: any) => ({
      id: item._id?.toString() || item.id,
      plateNumber:
        item.truck?.plateNumber || item.truckId?.plateNumber || "Unknown",
      make: item.truck?.make || item.truckId?.make,
      model: item.truck?.model || item.truckId?.model,
      year: item.truck?.year || item.truckId?.year,
      companyName: item.truck?.companyName || item.truckId?.companyName,
      productName: item.product?.name || item.productId?.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
      status: item.status,
      signature: item.signature,
      dispenserName: item.dispenser?.name || item.dispenserId?.name,
      attendantName:
        item.attendance?.attendantId?.userId?.name ||
        item.attendance?.attendantId?.name,
      completedAt: item.status === "completed" ? item.updatedAt : null,
    }));

    return {
      id: order.id,
      orderNumber:
        order.orderNumber || order._id?.toString().slice(-8).toUpperCase(),
      companyName: order.company?.name || order.companyId?.name,
      productId: order.productId?.toString(),
      productName: order.product?.name || order.productId?.name,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      items: items,
    };
  } catch (err) {
    console.error("❌ getOrderById error:", err);
    return null;
  }
}

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrdersByProductId(productId: string) {
  try {
    const orders = await getOrdersByProductIdService(productId);

    return Array.isArray(orders) ? orders.map(mapOrder) : [];
  } catch (err) {
    console.error("❌ getOrdersByProductId error:", err);
    return [];
  }
}

// data/invoice-orders.ts
export async function getInvoiceOrders(invoiceId: string) {
  try {
    const orders = await getInvoiceOrdersService(invoiceId);
    if (!orders.length) return [];

    return orders.map((order: any) => {
      const mappedItems = order.items.map((item: any) => ({
        id: item._id.toString(),
        truckName: item.truckId?.plateNumber || "Unknown Truck",
        quantity: Number(item.quantity || 0),
      }));

      return {
        ...mapOrder(order),
        items: mappedItems,
      };
    });
  } catch (err) {
    console.error("❌ getInvoiceOrders error:", err);
    return [];
  }
}

export async function getMineInvoiceOrders(invoiceId: string) {
  try {
    const orders = await getInvoiceOrdersService(invoiceId);
    const mineOrders = await getMineInvoiceOrdersService(invoiceId);

    if (!orders.length) return [];

    return mineOrders;
  } catch (err) {
    console.error("❌ getInvoiceOrders error:", err);
    return [];
  }
}

export async function getAvailableStockForProduct(productId: string) {
  try {
    const result = await getAvailableStockForProductService(productId);

    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ getAvailableStockForProduct error:", error);
    return { success: false, message: error.message, data: null };
  }
}
