import { StaffDetailsClient } from "@/components/(dashboard)/staffs/[id]/client";
import { getStaffById } from "@/data/staff";
import { notFound } from "next/navigation";

export default async function StaffDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const staff = await getStaffById(id);

  if (!staff?.success || !staff.data) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-10 px-0 md:px-4">
      <StaffDetailsClient staff={staff.data} />
    </div>
  );
}
