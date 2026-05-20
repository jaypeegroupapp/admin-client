import { TankerClientPage } from "@/components/(dashboard)/tankers/client";
import { getTankers } from "@/data/tanker";

export const dynamic = "force-dynamic";

export default async function TankersPage() {
  const result = await getTankers();
  return <TankerClientPage initialTankers={result.data || []} />;
}
