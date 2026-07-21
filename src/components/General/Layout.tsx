"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Account from "@/components/Account/Account";
import Overview from "@/components/Account/Overview";
import AccountAnalysis from "@/components/Account/AccountAnalysis";
import AccountSequences from "@/components/Account/AccountSequences";
import AccountMyAccount from "@/components/Account/AccountMyAccount";
import AccountSecurity from "@/components/Account/AccountSecurity";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [component, setComponent] = useState(<Overview />);
  const pathname = usePathname();
  const isAccountPage = pathname.includes("/account");

  const findAccountComponent = useCallback((pathname: string) => {
    const accountComponents = [
      { link: "/account/analysis", component: <AccountAnalysis /> },
      { link: "/account/sequences", component: <AccountSequences /> },
      { link: "/account/my-account", component: <AccountMyAccount /> },
      { link: "/account/security", component: <AccountSecurity /> },
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
