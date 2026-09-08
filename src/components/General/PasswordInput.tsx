"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { input_class } from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

const PasswordInput: React.FC<{
  field: Record<string, unknown>;
  autoComplete?: string;
}> = ({ field, autoComplete }) => {
  const [show, setShow] = useState(false);
  const lang = useLanguage();
  const gen = getTranslateClient(lang).dictionary.General;
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`${input_class} pr-11`}
        autoComplete={autoComplete}
        {...field}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? gen.hidePassword : gen.showPassword}
        aria-pressed={show}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
