"use client";

import React from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import {
  User2,
  DnaIcon,
  LucideSearch,
  PanelBottom,
  Settings,
  LockIcon,
  FileQuestion,
} from "lucide-react";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

interface SidebarLink {
  linkName: string;
  icon: React.ReactNode;
  link: string;
  disabled: boolean;
}

const Account = ({ accountComponent }: { accountComponent: React.ReactNode }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);

  const sidebarLinks: SidebarLink[] = [
    {
      linkName: AccountDict.sidebar.overview,
      link: "/account",
      icon: <PanelBottom size={24} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.sequences,
      link: "/account/sequences",
      icon: <DnaIcon size={24} />,
      disabled: true,
    },
    {
      linkName: AccountDict.sidebar.analysis,
      link: "/account/analysis",
      icon: <LucideSearch size={24} />,
      disabled: true,
    },
    {
      linkName: AccountDict.sidebar.myAccount,
      link: "/account/my-account",
      icon: <User2 size={24} />,
      disabled: true,
    },
    {
      linkName: AccountDict.sidebar.security,
      link: "/account/security",
      icon: <LockIcon size={24} />,
      disabled: true,
    },
    {
      linkName: AccountDict.sidebar.settings,
      link: "/account/settings",
      icon: <Settings size={24} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.tutorial,
      link: "/tutorial",
      icon: <FileQuestion size={24} />,
      disabled: false,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar className="sticky top-24 h-[calc(100vh-theme(spacing.24))] bg-cabgen-400">
        {sidebarLinks.map(({ linkName, icon, link, disabled }) => (
          <SidebarItem
            key={link}
            icon={icon}
            text={linkName}
            href={link}
            disabled={disabled}
          />
        ))}
      </Sidebar>
      <div className="w-full flex flex-row justify-around py-5 gap-5">{accountComponent}</div>
    </div>
  );
};

export default Account;
