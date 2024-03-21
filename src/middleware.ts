import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const user = request.cookies.get("cabgenAuthCookie")?.value;

  const loginURL = new URL("/login", request.url);
  const userURL = new URL("/account", request.url);

  if (!user) {
    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(loginURL);
  }

  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    return NextResponse.redirect(userURL);
  }
}

export const config = {
  matcher: ["/login", "/register", "/account/:path*"],
};
