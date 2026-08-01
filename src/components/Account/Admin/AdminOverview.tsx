"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Globe,
  Cpu,
  FlaskConical,
  HeartPulse,
  Bug,
  Microscope,
  Dna,
  Search,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/General/PageHeader";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { useGetUsersQuery } from "@/redux/services/admin/adminUsersService";

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  disabled?: boolean;
}

const AdminCard: React.FC<AdminCardProps> = ({ icon, title, href, disabled }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => !disabled && router.push(href)}
      className={`bg-white rounded-lg shadow-md border border-gray-100 p-5 flex items-center gap-4 transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{title}</p>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const lang = useLanguage();
  const router = useRouter();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  const { data: users = [] } = useGetUsersQuery();

  const cards: AdminCardProps[] = [
    { icon: <Users size={24} />, title: `${dict.users} (${users.length})`, href: "/account/admin/users" },
    { icon: <Globe size={24} />, title: dict.origins, href: "#", disabled: true },
    { icon: <Cpu size={24} />, title: dict.sequencers, href: "#", disabled: true },
    { icon: <FlaskConical size={24} />, title: dict.sampleSources, href: "#", disabled: true },
    { icon: <HeartPulse size={24} />, title: dict.healthServices, href: "#", disabled: true },
    { icon: <Bug size={24} />, title: dict.microorganisms, href: "#", disabled: true },
    { icon: <Microscope size={24} />, title: dict.laboratories, href: "#", disabled: true },
    { icon: <Dna size={24} />, title: dict.allSamples, href: "#", disabled: true },
    { icon: <Search size={24} />, title: dict.allAnalyses, href: "#", disabled: true },
  ];

  return (
    <div>
      <PageHeader icon={<Shield size={24} />} title={AccountDict.sidebar.admin} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <AdminCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
