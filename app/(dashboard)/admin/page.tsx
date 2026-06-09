import { AdminDashboardClient } from "@/components/(dashboard)/admin/client";
import { getAdminDashboardData } from "@/data/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dashboardData = await getAdminDashboardData();

  return (
    <div className="max-w-7xl mx-auto">
      <AdminDashboardClient initialData={dashboardData} />
    </div>
  );
}
