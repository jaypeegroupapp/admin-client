import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { PAGE_PERMISSIONS } from "./constants";
import { can } from "@/lib/rbac";

const PUBLIC_PATHS = ["/login", "/unauthorized"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Ignore static / api
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.endsWith(".png")
  ) {
    return NextResponse.next();
  }

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // ✅ Allow public pages
  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next();
  }

  // 🚪 Not authenticated → login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Find protected page definition
  const page = PAGE_PERMISSIONS.find(
    (p) => path === p.href || path.startsWith(`${p.href}/`)
  );

  // Page does not require permissions
  if (!page) return NextResponse.next();

  // 🔐 RBAC check (cached permissions, NO DB)
  const allowed = await can(session?.user ?? [], page.action, page.resource);

  if (!allowed) {
    return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$).*)"],
};
