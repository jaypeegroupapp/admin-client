// app/(dashboard)/products/page.tsx
import { ProductClientPage } from "@/components/(dashboard)/products/client";
import { getProducts } from "@/data/product";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const result = await getProducts();
  return <ProductClientPage initialProducts={result.data || []} />;
}
