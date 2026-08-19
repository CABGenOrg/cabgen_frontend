"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarItem } from "./Sidebar";
import AdminNav from "./Admin/AdminNav";
import {
  UserCog,
  DnaIcon,
  LucideSearch,
  LayoutDashboard,
  Shield,
  LockIcon,
  Menu,
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const { user } = useAuth();
  const isAdmin = user?.user_role === "Admin";
  const isAdminSection = pathname.startsWith("/account/admin/");

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
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-5 flex-1">
      <div className="md:hidden sticky top-0 z-20 flex items-center px-4 py-3 bg-white border-b">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 active:bg-cabgen-400 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sidebar
        className="bg-cabgen-400"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      >
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
      <div className="w-full py-3 md:py-5 px-4 md:px-0 md:pr-4 min-w-0">
        {isAdminSection && <AdminNav />}
        {accountComponent}
      </div>
    </div>
  );
};

export default Account;
