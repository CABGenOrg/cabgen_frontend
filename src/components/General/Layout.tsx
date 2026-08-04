"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Account from "@/components/Account/Account";
import Overview from "@/components/Account/Overview";
import AccountAnalysis from "@/components/Account/AccountAnalysis";
import AccountAnalysisDetail from "@/components/Account/AccountAnalysisDetail";
import AccountSequences from "@/components/Account/AccountSequences";
import AccountMyAccount from "@/components/Account/AccountMyAccount";
import AccountSecurity from "@/components/Account/AccountSecurity";
import AdminOverview from "@/components/Account/Admin/AdminOverview";
import AdminUsers from "@/components/Account/Admin/AdminUsers";
import AdminOrigins from "@/components/Account/Admin/AdminOrigins";
import AdminSequencers from "@/components/Account/Admin/AdminSequencers";
import { useAuth } from "@/redux/AuthContext";
import { useLanguage } from "@/redux/LanguageContext";
import { i18n } from "@/i18n/i18n.config";
import Loading from "./Loading";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const lang = useLanguage();
  const isAccountPage = pathname.includes("/account");

  const findAccountComponent = useCallback((pathname: string) => {
    const accountComponents = [
      { link: "/account/admin/users", component: <AdminUsers /> },
      { link: "/account/admin/origins", component: <AdminOrigins /> },
      { link: "/account/admin/sequencers", component: <AdminSequencers /> },
      { link: "/account/admin", component: <AdminOverview /> },
      { link: "/account/analysis/", component: <AccountAnalysisDetail /> },
      { link: "/account/analysis", component: <AccountAnalysis /> },
      { link: "/account/sequences", component: <AccountSequences /> },
      { link: "/account/my-account", component: <AccountMyAccount /> },
      { link: "/account/security", component: <AccountSecurity /> },
      { link: "/account", component: <Overview /> },
    ];
    return accountComponents.find(({ link }) => pathname.includes(link));
  }, []);

  const component = useMemo(() => {
    return findAccountComponent(pathname)?.component ?? <Overview />;
  }, [pathname, findAccountComponent]);

  useEffect(() => {
    if (!isAccountPage) return;
    if (isLoading) return;
    if (!isAuthenticated) {
      const loginPath =
        lang === i18n.defaultLocale ? "/login" : `/${lang}/login`;
      router.replace(loginPath);
    }
  }, [isAccountPage, isLoading, isAuthenticated, router, lang]);

  if (isAccountPage && isLoading) {
    return <Account accountComponent={<Loading />} />;
  }

  if (isAccountPage && !isAuthenticated) {
    return null;
  }

  return (
    <>{isAccountPage ? <Account accountComponent={component} /> : children}</>
  );
};

export default Layout;
