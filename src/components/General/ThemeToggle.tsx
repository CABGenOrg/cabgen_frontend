"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { useLanguage } from "@/redux/LanguageContext";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const lang = useLanguage();
  const {
    dictionary: { General },
  } = getTranslateClient(lang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? General.toggleToLight : General.toggleToDark}
      title={isDark ? General.toggleToLight : General.toggleToDark}
      className="flex h-9 w-9 items-center justify-center rounded-md text-white dark:text-black hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
