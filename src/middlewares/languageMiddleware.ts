import { i18n, Locale } from "@/i18n/i18n.config";
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
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    const locale = matchLocale(languages, locales, i18n.defaultLocale);
    return locale;
  } catch {
    return i18n.defaultLocale;
  }
};

const languageMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;

    if (PUBLIC_FILE.test(pathname)) {
      return;
    }

    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    if (pathnameIsMissingLocale) {
      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
      const locale =
        cookieLocale && i18n.locales.includes(cookieLocale as Locale)
          ? cookieLocale
          : (getLocale(request) ?? i18n.defaultLocale);
      const search = request.nextUrl.search;

      if (locale === i18n.defaultLocale) {
        const newURL = new URL(`/${locale}${pathname}${search}`, request.url);
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-locale", locale);
        const res = NextResponse.rewrite(newURL, {
          request: { headers: requestHeaders },
        });
        res.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
        res.headers.set("x-locale", locale);
        return res;
      }

      const newURL = new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${search}`,
        request.url,
      );
      return NextResponse.redirect(newURL);
    }

    const defaultLocalePrefix = `/${i18n.defaultLocale}`;
    if (
      pathname === defaultLocalePrefix ||
      pathname.startsWith(`${defaultLocalePrefix}/`)
    ) {
      const strippedPath = pathname.slice(defaultLocalePrefix.length) || "/";

      const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
      const preferredLocale =
        cookieLocale && i18n.locales.includes(cookieLocale as Locale)
          ? cookieLocale
          : i18n.defaultLocale;

      if (preferredLocale !== i18n.defaultLocale) {
        const newURL = new URL(
          `/${preferredLocale}${strippedPath === "/" ? "" : strippedPath}${request.nextUrl.search}`,
          request.url,
        );
        return NextResponse.redirect(newURL);
      }

      const newURL = new URL(
        `${strippedPath}${request.nextUrl.search}`,
        request.url,
      );
      return NextResponse.redirect(newURL);
    }

    return next(request, _next);
  };
};

export default languageMiddleware;
