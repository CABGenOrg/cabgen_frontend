import "server-only";

import { i18n, Locale } from "../i18n/i18n.config";
import defaultDictionary from "./defaultDictionaries";

export const getTranslateServer = (locale: Locale) => {
  const dictionary =
    defaultDictionary[locale] ??
    defaultDictionary[i18n.defaultLocale as Locale];
  return { dictionary };
};
