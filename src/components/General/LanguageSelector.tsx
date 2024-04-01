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
import { Locale } from "@/i18n/i18n.config";

const LanguageSelector = () => {
  const { lang } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const [language, setLanguage] = useState(lang);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";

    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const changeLanguageURL = (newLanguage: Locale) => {
    const url = redirectedPathName(newLanguage);
    setLanguage(newLanguage);
    router.replace(url);
  };

  const languages = [
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/Menu/br.png"
          alt="Brazil flag"
          width={5000}
          height={2500}
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
          width={5000}
          height={2500}
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
          width={5000}
          height={2500}
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
