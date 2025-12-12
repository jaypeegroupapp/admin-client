import { OrderDetailsClient } from "@/components/(dashboard)/orders/[id]/client";
import { getOrderById } from "@/data/order";
import { getProductById } from "@/data/product";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return notFound();

  const product = await getProductById(order?.productId);
  if (!product.success || !product.data) return notFound();

  const productStock = product.data.stock;

  return (
    <div className="max-w-3xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <OrderDetailsClient order={order} productStock={productStock || 0} />
    </div>
  );
}
