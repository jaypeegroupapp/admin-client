// app/(dashboard)/order-items/page.tsx
import { OrderItemsClientPage } from "@/components/(dashboard)/truck-orders/client";
import { getAllOrderItems } from "@/data/order-item";

export const dynamic = "force-dynamic";

export default async function OrderItemsPage() {
  const items = await getAllOrderItems();
  return <OrderItemsClientPage initialItems={items || []} />;
}
