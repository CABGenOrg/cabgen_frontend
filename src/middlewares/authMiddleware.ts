import { CustomMiddleware } from "./chain";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const authMiddleware = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const user = request.cookies.get("cabgenAuthCookie")?.value;

    const loginURL = new URL("/login", request.url);
    const userURL = new URL("/account", request.url);

    const responseNext = NextResponse.next();
    const responseRedirect = (url: URL) => NextResponse.redirect(url);

    if (!user) {
      if (request.nextUrl.pathname === "/account") {
        return middleware(request, event, responseRedirect(loginURL));
      } else {
        return middleware(request, event, responseNext);
      }
    }

    if (
      request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register"
    ) {
      return middleware(request, event, responseRedirect(userURL));
    }
  };
};

export default authMiddleware;
