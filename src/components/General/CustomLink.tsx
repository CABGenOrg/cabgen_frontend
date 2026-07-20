"use client";
import Link from "next/link";
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
  const path = lang ? `/${lang}${href}` : `/${language}${href}`;

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
