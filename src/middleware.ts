import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, authRoutes } from "./routes"; // import both route lists

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get("jwt_auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route));

  // 🚫 If the user is trying to access a protected route without JWT
  if (isProtected && !jwt) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 If the user is logged in and trying to access login/register
  if (jwt && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
