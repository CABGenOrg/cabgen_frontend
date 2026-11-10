"use client";

import React, { useMemo } from "react";
import { useGetHealthQuery } from "@/redux/services/health/healthService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

const OFFICIAL_URL = process.env.NEXT_PUBLIC_OFFICIAL_URL || "#";

const renderMessage = (message: string, url: string): React.ReactNode => {
  const parts = message.split("{link}");
  if (parts.length !== 2) return message;

  const [before, rest] = parts;
  const [linkText, after] = rest.split("{endLink}");

  return (
    <>
      {before}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-yellow-400 transition-colors"
      >
        {linkText}
      </a>
      {after}
    </>
  );
};

const WarningBanner = () => {
  const lang = useLanguage();
  const { dictionary } = getTranslateClient(lang);
  const { data: health, isLoading } = useGetHealthQuery();

  const messageKey = useMemo(() => {
    if (health?.status && health.status !== "ok") {
      return health.status;
    }
    return process.env.NEXT_PUBLIC_WARNING_KEY || null;
  }, [health]);

  if (isLoading || !messageKey) return null;

  const warnings = dictionary.warnings as Record<string, string>;
  const message = warnings[messageKey];
  if (!message) return null;

  return (
    <div
      className="bg-red-600 text-white text-center py-3 px-4"
      role="alert"
      aria-live="polite"
    >
      <div className="md:text-lg">
        {renderMessage(message, OFFICIAL_URL)}
      </div>
    </div>
  );
};

export default WarningBanner;
