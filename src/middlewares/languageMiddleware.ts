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
        // Keep URL without prefix but render as /{locale}{pathname} — set locale header and continue chain so auth runs
        request.headers.set("x-locale", locale);
        try {
          request.cookies.set("NEXT_LOCALE", locale);
        } catch {}
        request.nextUrl.pathname = `/${locale}${pathname}`;
        const res = (await next(request, _next)) as NextResponse ?? NextResponse.next();
        try {
          if ("cookies" in res) (res as NextResponse).cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
        } catch {}
        try {
          res.headers.set("x-locale", locale);
        } catch {}
        return res as NextResponse;
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

    // Path has locale prefix (e.g. /en/..., /es/...), expose it to server components via header + request cookie
    const localeFromPath = pathname.split("/")[1];
    const hasLocalePrefix = (i18n.locales as readonly string[]).includes(localeFromPath);
    if (hasLocalePrefix) {
      try {
        request.headers.set("x-locale", localeFromPath);
      } catch {}
      try {
        request.cookies.set("NEXT_LOCALE", localeFromPath);
      } catch {}
    }

    const rawResponse = await next(request, _next);
    const response = (rawResponse as NextResponse) ?? NextResponse.next();
    // Persist locale for future requests
    if (hasLocalePrefix && "cookies" in response) {
      try {
        (response as NextResponse).cookies.set("NEXT_LOCALE", localeFromPath, { path: "/", sameSite: "lax" });
      } catch {}
      try {
        response.headers.set("x-locale", localeFromPath);
      } catch {}
    }
    return response as NextResponse;
  };
};

export default languageMiddleware;
