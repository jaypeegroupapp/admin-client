import { MineDetailsClient } from "@/components/(dashboard)/mines/[id]/client";
import { getMineById } from "@/data/mine";
import { notFound } from "next/navigation";

export default async function MineDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const mine = await getMineById(id);

  if (!mine?.success || !mine.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <MineDetailsClient mine={mine.data} />
    </div>
  );
}
