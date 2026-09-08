"use client";

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { section_btn } from "@/styles/tailwind_classes";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const lang = useLanguage();
  const errorDict = getTranslateClient(lang).dictionary.ErrorPages;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4 py-16">
      <AlertTriangle size={48} className="text-cabgen-400 mb-4" />
      <h1 className="text-2xl md:text-3xl font-semibold mb-3">
        <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
          {errorDict.errorTitle}
        </span>
      </h1>
      <p className="text-gray-500 mb-6 max-w-md">{errorDict.errorDescription}</p>
      <button type="button" className={section_btn} onClick={reset}>
        {errorDict.retry}
      </button>
    </div>
  );
};

export default ErrorPage;
