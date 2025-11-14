// app/(dashboard)/trucks/page.tsx
import { TruckClientPage } from "@/components/(dashboard)/trucks/client";
import { getTrucks } from "@/data/truck";

export const dynamic = "force-dynamic";

export default async function TrucksPage() {
  const result = await getTrucks();
  return <TruckClientPage initialTrucks={result || []} />;
}
