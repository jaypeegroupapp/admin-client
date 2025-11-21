// app/(dashboard)/mines/page.tsx
import { MinesClientPage } from "@/components/(dashboard)/mines/client";
import { getMines } from "@/data/mine";

export const dynamic = "force-dynamic";

export default async function MinesPage() {
  const result = await getMines();
  return <MinesClientPage initialMines={result.data || []} />;
}
