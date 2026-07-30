"use client";
import Link from "next/link";
import { i18n } from "@/i18n/i18n.config";
import { useLanguage } from "@/redux/LanguageContext";

interface CustomLinkProps {
  href: string;
  lang?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const CustomLink = ({
  href,
  lang,
  disabled,
  children,
  className = "",
}: CustomLinkProps) => {
  const language = useLanguage();

  const buildPath = (locale: string) => {
    if (href.startsWith("http") || href.startsWith("#")) return href;
    return locale === i18n.defaultLocale ? href : `/${locale}${href}`;
  };

  const path = lang ? buildPath(lang) : buildPath(language);

  return (
    <Link
      href={path}
      className={disabled ? `${className} pointer-events-none` : className}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
