import { MiddlewareFactory } from "./chain";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const accountRegex = /\/account/i;

const authMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const accessToken = request.cookies.get("AccessCookie")?.value;
    const refreshToken = request.cookies.get("RefreshCookie")?.value;

    if (
      !accessToken &&
      !refreshToken &&
      accountRegex.test(request.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return next(request, _next);
  };
};

export default authMiddleware;
