import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, authRoutes } from "./routes";

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt_auth_token")?.value;
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));
  console.log(jwt);
  if (isProtected && !jwt) {
    console.log("🔒 Protected route - redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (jwt && isAuthPage) {
    console.log("✅ Logged in user on auth page - redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
