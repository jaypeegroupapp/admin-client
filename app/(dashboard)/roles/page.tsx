import { RolesClientPage } from "@/components/(dashboard)/roles/client";
import { getRoles } from "@/data/role";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const result = await getRoles();
  return <RolesClientPage initialRoles={result.data || []} />;
}
