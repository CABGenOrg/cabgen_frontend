import { MiddlewareFactory } from "./chain";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const accountRegex = /\/account/i;
const loginRegex = /\/login/i;
const registerRegex = /\/register/i;

const authMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const accessToken = request.cookies.get("AccessCookie")?.value;
    const refreshToken = request.cookies.get("RefreshCookie")?.value;
    const loginURL = new URL("/login", request.url);
    const userURL = new URL("/account", request.url);

    const responseNext = NextResponse.next();
    const responseRedirect = (url: URL) => NextResponse.redirect(url);

    if (!accessToken && !refreshToken) {
      if (accountRegex.test(request.nextUrl.pathname)) {
        return responseRedirect(loginURL);
      } else {
        return responseNext;
      }
    }

    if (
      loginRegex.test(request.nextUrl.pathname) ||
      registerRegex.test(request.nextUrl.pathname)
    ) {
      return responseRedirect(userURL);
    }

    return next(request, _next);
  };
};

export default authMiddleware;
