// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRoute } from "./routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_auth_token")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage = authRoute.includes(pathname);
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and public routes
    "/((?!_next/.*|favicon.ico).*)",
  ],
};
