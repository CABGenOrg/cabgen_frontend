export const i18n = {
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
} as const;

export type Locale = (typeof i18n)["locales"][number];
