import { OrderDetailsClient } from "@/components/(dashboard)/orders/[id]/client";
import { getOrderById } from "@/data/order";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <OrderDetailsClient order={order} />
    </div>
  );
}
