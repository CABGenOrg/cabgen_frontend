import Link from "next/link";
import { cookies, headers } from "next/headers";
import { FileQuestion } from "lucide-react";
import { i18n, type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { section_btn } from "@/styles/tailwind_classes";

const NotFound = async ({
  params,
}: {
  params?: Promise<{ lang: Locale }>;
}) => {
  let lang: Locale | undefined;
  try {
    const p = await params;
    lang = p?.lang;
  } catch {}

  if (!lang || !(i18n.locales as readonly string[]).includes(lang)) {
    try {
      const cookieStore = await cookies();
      const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
      if (cookieLocale && (i18n.locales as readonly string[]).includes(cookieLocale)) {
        lang = cookieLocale as Locale;
      }
    } catch {}
  }

  if (!lang || !(i18n.locales as readonly string[]).includes(lang)) {
    try {
      const h = await headers();
      const headerLocale = h.get("x-locale");
      if (headerLocale && (i18n.locales as readonly string[]).includes(headerLocale)) {
        lang = headerLocale as Locale;
      }
    } catch {}
  }

  const resolvedLang = (lang ?? (i18n.defaultLocale as Locale)) as Locale;
  const errorDict = getTranslateServer(resolvedLang).dictionary.ErrorPages;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
      <FileQuestion size={48} className="text-cabgen-400 mb-4" />
      <p className="text-6xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-2xl font-semibold mb-3">{errorDict.notFoundTitle}</h1>
      <p className="text-gray-500 mb-6 max-w-md">{errorDict.notFoundDescription}</p>
      <Link href={`/${resolvedLang}`} className={section_btn}>
        {errorDict.backHome}
      </Link>
    </div>
  );
};

export default NotFound;
