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
import AdminLaboratories from "@/components/Account/Admin/AdminLaboratories";
import AdminHealthServices from "@/components/Account/Admin/AdminHealthServices";
import AdminSampleSources from "@/components/Account/Admin/AdminSampleSources";
import AdminMicroorganisms from "@/components/Account/Admin/AdminMicroorganisms";
import AdminTickets from "@/components/Account/Admin/AdminTickets";
import AdminSamples from "@/components/Account/Admin/AdminSamples";
import AdminAnalyses from "@/components/Account/Admin/AdminAnalyses";
import { useAuth } from "@/redux/AuthContext";
import { useLanguage } from "@/redux/LanguageContext";
import { i18n } from "@/i18n/i18n.config";
import Loading from "./Loading";
import { getTranslateClient } from "@/lib/getTranslateClient";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const lang = useLanguage();
  const isAccountPage = pathname.includes("/account");
  const { dictionary } = getTranslateClient(lang);

  const titleMap: Record<string, string> = useMemo(
    () => ({
      "/account/admin/users": dictionary.Account.admin.users,
      "/account/admin/origins": dictionary.Account.admin.origins,
      "/account/admin/sequencers": dictionary.Account.admin.sequencers,
      "/account/admin/laboratories": dictionary.Account.admin.laboratories,
      "/account/admin/health-services": dictionary.Account.admin.healthServices,
      "/account/admin/sample-sources": dictionary.Account.admin.sampleSources,
      "/account/admin/microorganisms": dictionary.Account.admin.microorganisms,
      "/account/admin/tickets": dictionary.Account.admin.tickets,
      "/account/admin/samples": dictionary.Account.admin.allSamples,
      "/account/admin/analyses": dictionary.Account.admin.allAnalyses,
      "/account/admin": dictionary.Account.admin.overview.title,
      "/account/analysis": dictionary.Account.analyses.title,
      "/account/sequences": dictionary.Account.sequences.title,
      "/account/my-account": dictionary.Account.myAccount.title,
      "/account/security": dictionary.Account.security.title,
      "/account": dictionary.Account.overview.title,
      "/about": dictionary.About.title,
      "/contact": dictionary.Contact.title,
      "/dashboard": dictionary.Dashboard.sectionTitle,
      "/login": dictionary.Login.title,
      "/register": dictionary.Register.title,
      "/network": dictionary.Network.title,
      "/maintenance": dictionary.Maintenance.sectionTitle,
      "/forgot-password": dictionary.ForgotPassword.title,
      "/reset-password": dictionary.ResetPassword.title,
      "/confirm-email-update": dictionary.Account.security.confirmEmailTitle,
    }),
    [dictionary],
  );

  useEffect(() => {
    const match = Object.keys(titleMap)
      .sort((a, b) => b.length - a.length)
      .find((route) => pathname.includes(route));
    document.title = match ? `${titleMap[match]} | CABGen` : "CABGen";
  }, [pathname, titleMap]);

  const findAccountComponent = useCallback((pathname: string) => {
    const accountComponents = [
      { link: "/account/admin/users", component: <AdminUsers /> },
      { link: "/account/admin/origins", component: <AdminOrigins /> },
      { link: "/account/admin/sequencers", component: <AdminSequencers /> },
      { link: "/account/admin/laboratories", component: <AdminLaboratories /> },
      { link: "/account/admin/health-services", component: <AdminHealthServices /> },
      { link: "/account/admin/sample-sources", component: <AdminSampleSources /> },
      { link: "/account/admin/microorganisms", component: <AdminMicroorganisms /> },
      { link: "/account/admin/tickets", component: <AdminTickets /> },
      { link: "/account/admin/samples", component: <AdminSamples /> },
      { link: "/account/admin/analyses", component: <AdminAnalyses /> },
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