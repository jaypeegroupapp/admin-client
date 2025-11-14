import { OrderClientPage } from "@/components/(dashboard)/orders/client";
import { getOrders } from "@/data/order";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrderClientPage initialOrders={orders || []} />;
}
