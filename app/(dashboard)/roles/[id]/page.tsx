import { RoleDetailsClient } from "@/components/(dashboard)/roles/[id]/client";
import { getRoleById } from "@/data/role";
import { notFound } from "next/navigation";

export default async function RoleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const role = await getRoleById(id);

  if (!role?.success || !role.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <RoleDetailsClient role={role.data} />
    </div>
  );
}
