import { ProfileClient } from "@/components/(dashboard)/profile/client";
import { getSessionStaff } from "@/data/staff";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSession();
  const staff = await getSessionStaff();
  console.log(staff);

  if (!staff.success) return null;

  return (
    <ProfileClient
      user={{ email: user?.email as string }}
      staff={{ name: staff?.data?.name as string }!}
    />
  );
}
