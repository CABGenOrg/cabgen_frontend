import { NextRequest } from "next/server";
import { i18n } from "@/i18n/i18n.config";

export const buildURLWithLanguage = (request: NextRequest, URLPath: string) => {
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  // @ts-ignore locales são readonly
  const isValidLocale = i18n.locales.includes(firstSegment);

  const lang = isValidLocale ? firstSegment : i18n.defaultLocale;
  const prefix = lang === i18n.defaultLocale ? "" : `/${lang}`;
  const path = URLPath === "/" ? "" : URLPath;

  return new URL(`${prefix}${path}` || "/", request.url);
};
