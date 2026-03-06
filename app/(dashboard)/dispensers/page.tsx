// app/(dashboard)/dispensers/page.tsx
import { DispenserClientPage } from "@/components/(dashboard)/dispensers/client";
import { getDispensers } from "@/data/dispenser";

export const dynamic = "force-dynamic";

export default async function DispensersPage() {
  const result = await getDispensers();
  return <DispenserClientPage initialDispensers={result.data || []} />;
}
