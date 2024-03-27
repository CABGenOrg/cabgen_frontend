import { i18n } from "@/i18n/i18n.config";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactory } from "./chain";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
const PUBLIC_FILE = /\.(.*)$/;

export const getLocale = (request: NextRequest): string | undefined => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders })
    .languages()
    .map((value) => value.split("-")[0]);

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
};

const languageMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (PUBLIC_FILE.test(request.nextUrl.pathname)) {
      return;
    }

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      if (locale === i18n.defaultLocale) {
        const newURL = new URL(`/${locale}${pathname}`, request.url);
        return NextResponse.rewrite(newURL);
      }

      const newURL = new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      );
      return NextResponse.redirect(newURL);
    }

    return next(request, _next);
  };
};

export default languageMiddleware;
