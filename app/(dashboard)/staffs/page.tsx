// app/(dashboard)/staff/page.tsx
import { StaffClientPage } from "@/components/(dashboard)/staffs/client";
import { getStaffs } from "@/data/staff";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const result = await getStaffs();
  return <StaffClientPage initialStaffs={result.data || []} />;
}
