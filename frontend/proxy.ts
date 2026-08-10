import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookie-names";

const AUTH_PAGES = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value);
  const { pathname } = request.nextUrl;
  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resumes/:path*",
    "/jobs/:path*",
    "/ats/:path*",
    "/interviews/:path*",
    "/chat/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
