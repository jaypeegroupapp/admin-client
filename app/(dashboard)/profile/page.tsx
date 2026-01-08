import { ProfileClient } from "@/components/(dashboard)/profile/client";
import { getSessionStaff } from "@/data/staff";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = (await getSession()) as any;
  const staff = await getSessionStaff();

  if (!staff.success) return null;

  return (
    <ProfileClient
      user={{ email: session?.user?.email as string }}
      staff={{ name: staff?.data?.name as string }!}
    />
  );
}
