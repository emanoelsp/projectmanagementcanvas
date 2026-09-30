import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/canvas", "/admin"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/canvas/:path*", "/admin/:path*", "/auth/:path*"],
};
