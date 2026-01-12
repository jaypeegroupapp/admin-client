import { PAGE_PERMISSIONS } from "@/constants";
import { canClient } from "@/lib/rbac";
import { PagePermission } from "@/constants";
import DashboardLayoutClient from "@/components/(dashboard)/layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allowedPages: PagePermission[] = [];

  for (const page of PAGE_PERMISSIONS) {
    const allowed = await canClient(page.action, page.resource);
    if (allowed) allowedPages.push(page);
  }

  return (
    <DashboardLayoutClient allowedPages={allowedPages}>
      {children}
    </DashboardLayoutClient>
  );
}
