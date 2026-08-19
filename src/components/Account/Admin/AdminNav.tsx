"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Globe,
  Cpu,
  FlaskConical,
  HeartPulse,
  Bug,
  Microscope,
  MessageSquare,
  Dna,
  Search,
} from "lucide-react";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

const adminTabs = [
  { icon: Users, href: "/account/admin/users", dictKey: "users" },
  { icon: Globe, href: "/account/admin/origins", dictKey: "origins" },
  { icon: Cpu, href: "/account/admin/sequencers", dictKey: "sequencers" },
  {
    icon: FlaskConical,
    href: "/account/admin/sample-sources",
    dictKey: "sampleSources",
  },
  {
    icon: HeartPulse,
    href: "/account/admin/health-services",
    dictKey: "healthServices",
  },
  {
    icon: Bug,
    href: "/account/admin/microorganisms",
    dictKey: "microorganisms",
  },
  {
    icon: Microscope,
    href: "/account/admin/laboratories",
    dictKey: "laboratories",
  },
  { icon: MessageSquare, href: "/account/admin/tickets", dictKey: "tickets" },
  { icon: Dna, href: "/account/admin/samples", dictKey: "allSamples" },
  { icon: Search, href: "/account/admin/analyses", dictKey: "allAnalyses" },
] as const;

const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  return (
    <nav className="flex justify-center gap-1 p-2 mb-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
      {adminTabs.map(({ icon: Icon, href, dictKey }) => {
        const active = pathname.includes(href);
        const label = dict[dictKey];
        return (
          <button
            key={href}
            type="button"
            onClick={() => router.push(href)}
            title={label}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`h-10 w-10 inline-flex items-center justify-center rounded-md transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 ${
              active
                ? "bg-cabgen-200 text-white ring-2 ring-cabgen-200 ring-offset-1"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </nav>
  );
};

export default AdminNav;