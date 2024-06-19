"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
// Default Account page
import Account from "@/app/[lang]/account/page";
// Account subpages
import Overview from "../Account/Overview";
import Analysis from "@/app/[lang]/account/analysis/page";
import Sequences from "@/app/[lang]/account/sequences/page";
import MyAccount from "@/app/[lang]/account/my-account/page";
import Security from "@/app/[lang]/account/security/page";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [component, setComponent] = useState(<Overview />);
  const pathname = usePathname();
  const isAccountPage = pathname.includes("/account");

  const findAccountComponent = useCallback((pathname: string) => {
    const accountComponents = [
      { link: "/account/analysis", component: <Analysis /> },
      { link: "/account/sequences", component: <Sequences /> },
      { link: "/account/my-account", component: <MyAccount /> },
      { link: "/account/security", component: <Security /> },
      { link: "/account", component: <Overview /> },
    ];
    return accountComponents.find(({ link }) => pathname.includes(link));
  }, []);

  useEffect(() => {
    const accountComponent = findAccountComponent(pathname);
    if (accountComponent) {
      setComponent(accountComponent.component);
    }
  }, [pathname, findAccountComponent]);

  return (
    <>{isAccountPage ? <Account accountComponent={component} /> : children}</>
  );
};

export default Layout;
