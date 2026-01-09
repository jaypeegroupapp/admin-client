import { StaffClientPage } from "@/components/(dashboard)/staffs/client";
import { getStaffs } from "@/data/staff";
import { getRoles } from "@/data/role";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const staffs = await getStaffs();
  const roles = await getRoles();
  if (!staffs.success || !roles.success || !staffs.data || !roles.data)
    return null;

  return (
    <StaffClientPage
      initialStaffs={staffs.data || []}
      roles={roles.data.map((r) => ({
        id: r.id || "",
        name: r.description || "",
      }))}
    />
  );
}
