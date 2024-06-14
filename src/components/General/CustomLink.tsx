"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";

interface CustomLinkProps {
  href: string;
  lang?: string;
  active?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

const CustomLink = ({ href, lang, active, ...props }: CustomLinkProps) => {
  const language = useSelector(selectCurrentLanguage);
  const path = lang ? `/${lang}${href}` : `/${language}${href}`;

  return (
    <Link
      href={path}
      className={active ? "" : "pointer-events-none"}
      {...props}
    />
  );
};

export default CustomLink;
