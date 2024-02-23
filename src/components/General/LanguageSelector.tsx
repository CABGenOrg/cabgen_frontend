"use client";

import React from "react";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const [language, setLanguage] = useLocalStorage("CabgenLanguage", "pt-BR");
  const languages = [
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/br.png"
          alt="Brazil flag"
          width={5000}
          height={2500}
        />
      ),
      name: "Português",
      value: "pt-BR",
    },
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/us.png"
          alt="USA flag"
          width={5000}
          height={2500}
        />
      ),
      name: "English",
      value: "en-US",
    },
    {
      flag: (
        <Image
          className="w-5 h-4"
          src="/es.png"
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
    <Select onValueChange={(e) => setLanguage(e)} value={language}>
      <SelectTrigger className="w-[138px] text-black">
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
