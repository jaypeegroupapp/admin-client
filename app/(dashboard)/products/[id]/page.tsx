import { ProductDetailsClient } from "@/components/(dashboard)/products/[id]/client";
import {
  getTotalQuantityForProduct,
  getOrdersByProduct,
} from "@/data/order-item";
import {
  getProductById,
  getTotalProductStockFromTankers,
} from "@/data/product";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const totalOrderQuantity = await getTotalQuantityForProduct(id);
  const orders = await getOrdersByProduct(id);
  const tankerData = await getTotalProductStockFromTankers(id);

  const quantities = {
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
  };

  orders.forEach((item: any) => {
    if (item.status === "pending") {
      quantities.pending += item.quantity;
    }
    if (item.status === "accepted") {
      quantities.accepted += item.quantity;
    }
  });

  if (!product?.success || !product.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <ProductDetailsClient
        product={product.data}
        totalOrderQuantity={totalOrderQuantity}
        tankerTotalStock={tankerData.totalStock}
        tankerTotalCapacity={tankerData.totalCapacity}
        pendingOrderQuantity={quantities.pending}
        acceptedOrderQuantity={quantities.accepted}
        orders={orders}
      />
    </div>
  );
}
