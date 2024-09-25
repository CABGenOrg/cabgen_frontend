import { MiddlewareFactory } from "./chain";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const blockedURLs = process.env.BLOCKED_URLS || "";
const blockedURLsRegex = new RegExp(blockedURLs.split(',').join('|'), "i");

const blockedURLsMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const lang = request.nextUrl.pathname.split('/')[1];

    const loginURL = new URL(`/${lang}/login`, request.url);

    const responseRedirect = (url: URL) => NextResponse.redirect(url);

    if (blockedURLs && blockedURLsRegex.test(request.nextUrl.pathname)) {
      return responseRedirect(loginURL);
    }

    return next(request, _next);
  };
};

export default blockedURLsMiddleware;
