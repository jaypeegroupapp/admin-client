// app/(dashboard)/dispensers/[id]/page.tsx
import { DispenserDetailsClient } from "@/components/(dashboard)/dispensers/[id]/client";
import { getDispenserById } from "@/data/dispenser";
import { getProductById } from "@/data/product";
import { getTotalDispenserUsage } from "@/data/dispenser-usage";
import { notFound } from "next/navigation";

export default async function DispenserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dispenser = await getDispenserById(id);
  const totalUsage = await getTotalDispenserUsage(id);

  if (!dispenser?.success || !dispenser.data) return notFound();

  // Get associated product details
  const product = await getProductById(dispenser.data.productId as string);

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <DispenserDetailsClient
        dispenser={dispenser.data}
        totalUsage={totalUsage}
        product={
          product && product.success && product.data ? product.data : null
        }
      />
    </div>
  );
}
