import {
  getOrdersService,
  getOrderByIdService,
  getOrdersByCompanyIdService,
} from "@/services/order";

const orderMap = (order: any) => ({
  id: order._id.toString(),
  userId: order.userId?._id || "",
  companyId: order.companyId?._id || "",
  productId: order.productId?._id || "",
  productName: order.productId?.name || "N/A",
  totalAmount: order.totalAmount,
  collectionDate: order.collectionDate,
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrders() {
  try {
    const orders = await getOrdersService();

    return Array.isArray(orders) ? orders.map(orderMap) : [];
  } catch (err) {
    console.error("❌ getOrders error:", err);
    return [];
  }
}

/**
 * 🧾 Fetch all orders and map to UI-friendly format
 */
export async function getOrdersByCompanyId(companyId: string) {
  try {
    const orders = await getOrdersByCompanyIdService(companyId);

    return Array.isArray(orders) ? orders.map(orderMap) : [];
  } catch (err) {
    console.error("❌ getOrders error:", err);
    return [];
  }
}

/**
 * 🧩 Fetch a single order by ID and map to UI-friendly format
 */
/**
 * 🧠 Wrapper for server-safe access (used in actions or routes)
 */
export async function getOrderById(id: string) {
  try {
    const order = await getOrderByIdService(id);
    if (!order) return null;

    // 🧾 Map items cleanly
    const items = order.items.map((item: any) => ({
      id: item._id.toString(),
      truckId: item.truckId?._id?.toString() || "",
      truckName: item.truckId?.plateNumber || "Unknown Truck",
      truckRegistration: item.truckId?.registrationNumber || "",
      quantity: Number(item.quantity || 0),
    }));

    // 🧱 Return serializable structure
    return {
      id: order._id.toString(),
      userId: order.userId?._id?.toString() || "",
      userName: order.userId?.fullName || "",
      companyId: order.companyId?._id?.toString() || "",
      companyName: order.companyId?.name || "",
      productId: order.productId?._id?.toString() || "",
      productName: order.productId?.name || "N/A",
      totalAmount: Number(order.totalAmount || 0),
      collectionDate: order.collectionDate
        ? new Date(order.collectionDate).toISOString()
        : "",
      status: order.status || "pending",
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
      updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : "",
      items,
    };
  } catch (err) {
    console.error("❌ getOrderById error:", err);
    return null;
  }
}
