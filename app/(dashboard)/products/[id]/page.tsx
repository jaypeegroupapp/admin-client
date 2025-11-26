import { ProductDetailsClient } from "@/components/(dashboard)/products/[id]/client";
import { getTotalQuantityForProduct } from "@/data/order-item";
import { getProductById } from "@/data/product";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const totalOrderQuantity = await getTotalQuantityForProduct(id);

  if (!product?.success || !product.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <ProductDetailsClient
        product={product.data}
        totalOrderQuantity={totalOrderQuantity}
      />
    </div>
  );
}
