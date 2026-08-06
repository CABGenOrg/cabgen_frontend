"use client";

import React from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import {
  UserCog,
  DnaIcon,
  LucideSearch,
  LayoutDashboard,
  Shield,
  LockIcon,
  FileQuestion,
} from "lucide-react";
import { useAuth } from "@/redux/AuthContext";
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
  const { user } = useAuth();
  const isAdmin = user?.user_role === "Admin";

  const sidebarLinks: SidebarLink[] = [
    {
      linkName: AccountDict.sidebar.overview,
      link: "/account",
      icon: <LayoutDashboard size={22} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.sequences,
      link: "/account/sequences",
      icon: <DnaIcon size={22} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.analysis,
      link: "/account/analysis",
      icon: <LucideSearch size={22} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.myAccount,
      link: "/account/my-account",
      icon: <UserCog size={22} />,
      disabled: false,
    },
    {
      linkName: AccountDict.sidebar.security,
      link: "/account/security",
      icon: <LockIcon size={22} />,
      disabled: false,
    },
    // {
    //   linkName: AccountDict.sidebar.tutorial,
    //   link: "/tutorial",
    //   icon: <FileQuestion size={22} />,
    //   disabled: true,
    // },
  ];

  return (
    <div className="flex min-h-screen gap-5">
      <Sidebar className="sticky top-24 h-[calc(100vh-theme(spacing.24))] bg-cabgen-400 z-20">
        {sidebarLinks.map(({ linkName, icon, link, disabled }) => (
          <SidebarItem
            key={link}
            icon={icon}
            text={linkName}
            href={link}
            disabled={disabled}
          />
        ))}
        {isAdmin && (
          <SidebarItem
            icon={<Shield size={22} />}
            text={AccountDict.sidebar.admin}
            href="/account/admin"
          />
        )}
      </Sidebar>
      <div className="w-full py-5 pr-4 min-w-0">{accountComponent}</div>
    </div>
  );
};

export default Account;
