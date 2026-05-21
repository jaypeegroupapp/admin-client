import { TankerDetailsClient } from "@/components/(dashboard)/tankers/[id]/client";
import { getTankerById } from "@/data/tanker";
import { getProductById } from "@/data/product";
import { getTankerDispensers } from "@/data/tanker-dispenser";
import { notFound } from "next/navigation";

export default async function TankerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tanker = await getTankerById(id);
  const dispensers = await getTankerDispensers(id);

  if (!tanker?.success || !tanker.data) return notFound();

  const product = await getProductById(tanker.data.productId as string);

  return (
    <div className="max-w-5xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <TankerDetailsClient
        tanker={tanker.data}
        product={product?.success ? product.data : null}
        connectedDispensers={dispensers.data || []}
      />
    </div>
  );
}
