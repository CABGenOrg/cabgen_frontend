"use client";

import React, { createContext, useContext } from "react";
import { Locale, i18n } from "@/i18n/i18n.config";

const LanguageContext = createContext<Locale>(i18n.defaultLocale);

export const LanguageProvider = ({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) => {
  return (
    <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
