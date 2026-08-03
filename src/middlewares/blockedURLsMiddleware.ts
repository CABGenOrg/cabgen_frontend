import { MiddlewareFactory } from "./chain";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { buildURLWithLanguage } from "@/utils/handleURLs";
import { i18n } from "@/i18n/i18n.config";

const nonDefaultLocales = i18n.locales.filter(
  (locale) => locale !== i18n.defaultLocale,
);
const localePrefixRegex = new RegExp(
  `^/(${nonDefaultLocales.join("|")})(?=/|$)`,
);

const blockedURLsMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const blockedURLs = process.env.BLOCKED_URLS || "";

    if (blockedURLs) {
      const patterns = blockedURLs
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      if (patterns.length > 0) {
        const regex = new RegExp(patterns.join("|"), "i");
        const pathWithoutLocale =
          request.nextUrl.pathname.replace(localePrefixRegex, "") || "/";

        if (regex.test(pathWithoutLocale)) {
          return NextResponse.redirect(buildURLWithLanguage(request, "/"));
        }
      }
    }

    return next(request, _next);
  };
};

export default blockedURLsMiddleware;
