"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useParams, useRouter } from "next/navigation";
import { i18n, Locale } from "@/i18n/i18n.config";

const LanguageSelector = () => {
  const { lang } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const currentLocale = Array.isArray(lang)
    ? lang[0]
    : (lang ?? i18n.defaultLocale);
  const [language, setLanguage] = useState(currentLocale);

  const redirectedPathName = (newLocale: string) => {
    if (!pathName) return "/";

    const segments = pathName.split("/");
    const firstSegment = segments[1];

    const hasLocalePrefix = i18n.locales.includes(firstSegment as Locale);
    const pathWithoutLocale = hasLocalePrefix
      ? segments.slice(2)
      : segments.slice(1);

    const rest = pathWithoutLocale.join("/");

    if (newLocale === i18n.defaultLocale) {
      return `/${rest}`;
    }
    return `/${newLocale}${rest ? `/${rest}` : ""}`;
  };

  const changeLanguageURL = (newLanguage: Locale) => {
    const url = redirectedPathName(newLanguage);
    setLanguage(newLanguage);
    document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; max-age=31536000`;
    
    router.replace(url);
    router.refresh();
  };

  const languages = [
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/Menu/br.png"
          alt="Brazil flag"
          width={80}
          height={64}
        />
      ),
      name: "Português",
      value: "pt",
    },
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/Menu/us.png"
          alt="USA flag"
          width={80}
          height={64}
        />
      ),
      name: "English",
      value: "en",
    },
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/Menu/es.png"
          alt="Spain flag"
          width={80}
          height={64}
        />
      ),
      name: "Español",
      value: "es",
    },
  ];

  return (
    <Select
      onValueChange={changeLanguageURL}
      value={Array.isArray(language) ? language[0] : language}
    >
      <SelectTrigger className="w-[138px] text-black focus-visible:ring-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ flag, name, value }, idx) => (
          <SelectItem key={idx} value={value}>
            <div className="text-black flex gap-2 flex-row justify-center items-center">
              {flag}
              {name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;