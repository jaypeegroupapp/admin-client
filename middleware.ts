import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/appointments",
  "/home",
  "/book-appointment",
  "/payment-history",
  "/profile",
  "/schedules",
  "/welcome",
  "/register/details",
  "/first-appointment",
];

const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    protectedRoutes.some(
      (str) => path.startsWith(str) || path.startsWith("/" + str)
    );
  const isRegistration =
    path.includes("/register/company") || path.includes("welcome");
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const registrationStep = (await cookies()).get("registrationStep")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect to /login if the user is not authenticated
  /* if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  } */

  if (!isRegistration && registrationStep && registrationStep === "0") {
    return NextResponse.redirect(new URL("/register/company", req.nextUrl));
  }

  /*   if (isRegistration && registrationStep) {
    if (registrationStep === "1") {
      return NextResponse.redirect(new URL("/new-intake", req.nextUrl));
    } else if (registrationStep === "2") {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
  } */

  // 5. Redirect to /dashboard if the user is authenticated
  /* if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/home")
  ) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  } */

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
