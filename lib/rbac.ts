"use server";
import { cookies } from "next/headers";
import { decrypt } from "./session";

type SessionUser = {
  permissions?: string[];
};

export async function can(
  user: SessionUser | null | undefined,
  action: string,
  resource: string
): Promise<boolean> {
  if (!user?.permissions?.length) return false;

  const perms = user.permissions;

  // 🟢 Full access
  if (perms.includes("*")) return true;

  const exact = `${resource}:${action}`;
  const resourceWildcard = `${resource}:*`;
  const actionWildcard = `*:${action}`;

  return (
    perms.includes(exact) ||
    perms.includes(resourceWildcard) ||
    perms.includes(actionWildcard)
  );
}

export async function canClient(
  action: string,
  resource: string
): Promise<boolean> {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.user) return false;

  return can(session.user, action, resource);
}
