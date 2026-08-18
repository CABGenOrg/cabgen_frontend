"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Globe,
  FlaskConical,
  Dna,
  Search,
  Shield,
  Bug,
  Cpu,
  HeartPulse,
  Microscope,
  MessageSquare,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import PageHeader from "@/components/General/PageHeader";
import Loading from "@/components/General/Loading";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { useGetAdminMetricsQuery } from "@/redux/services/admin/adminMetricsService";

const STATUS_COLORS: Record<string, string> = {
  pending: "#FCD34D",
  running: "#60A5FA",
  done: "#34D399",
  failed: "#F87171",
};

const BAR_COLORS = ["#0A6354", "#59A5D8", "#34B290", "#F59E0B", "#8B5CF6"];

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
}> = ({ icon, value, label }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    <div className="h-[300px] md:h-[350px]">{children}</div>
  </div>
);

const AdminOverview = () => {
  const lang = useLanguage();
  const router = useRouter();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const overviewDict = dict.overview;
  const statusValues = AccountDict.analyses.statusValues;

  const navCards = [
    { icon: <Users size={24} />, title: dict.users, href: "/account/admin/users" },
    { icon: <Globe size={24} />, title: dict.origins, href: "/account/admin/origins" },
    { icon: <Cpu size={24} />, title: dict.sequencers, href: "/account/admin/sequencers" },
    { icon: <FlaskConical size={24} />, title: dict.sampleSources, href: "/account/admin/sample-sources" },
    { icon: <HeartPulse size={24} />, title: dict.healthServices, href: "/account/admin/health-services" },
    { icon: <Bug size={24} />, title: dict.microorganisms, href: "/account/admin/microorganisms" },
    { icon: <Microscope size={24} />, title: dict.laboratories, href: "/account/admin/laboratories" },
    { icon: <MessageSquare size={24} />, title: dict.tickets, href: "/account/admin/tickets" },
    { icon: <Dna size={24} />, title: dict.allSamples, href: "/account/admin/samples" },
    { icon: <Search size={24} />, title: dict.allAnalyses, href: "/account/admin/analyses" },
  ];

  const { data: metrics, isLoading } = useGetAdminMetricsQuery();

  if (isLoading) return <Loading />;

  const statusData = metrics
    ? Object.entries(metrics.analyses_by_status ?? {})
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
          name:
            (statusValues as Record<string, string>)[key] ??
            key[0].toUpperCase() + key.slice(1),
          value,
          fill: STATUS_COLORS[key] ?? STATUS_COLORS.failed,
        }))
    : [];

  const countryData = (metrics?.top_countries ?? [])
    .filter((c) => c.count > 0)
    .slice(0, 5)
    .map((c, i) => ({
      name: c.country,
      value: c.count,
      fill: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const speciesData = (metrics?.species_breakdown ?? [])
    .filter((s) => s.count > 0)
    .slice(0, 5)
    .map((s, i) => ({
      name: s.species,
      value: s.count,
      fill: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const cards = [
    {
      icon: <Dna size={24} />,
      value: metrics?.total_samples ?? 0,
      label: overviewDict.totalSamples,
    },
    {
      icon: <Search size={24} />,
      value: metrics?.total_analyses ?? 0,
      label: overviewDict.totalAnalyses,
    },
    {
      icon: <Users size={24} />,
      value: metrics?.total_users ?? 0,
      label: overviewDict.totalUsers,
    },
    {
      icon: <Globe size={24} />,
      value: metrics?.total_countries ?? 0,
      label: overviewDict.totalCountries,
    },
    {
      icon: <Bug size={24} />,
      value: metrics?.total_species ?? 0,
      label: overviewDict.totalSpecies,
    },
    {
      icon: <FlaskConical size={24} />,
      value: metrics?.total_resistance_genes ?? 0,
      label: overviewDict.totalResistanceGenes,
    },
  ];

  return (
    <div>
      <PageHeader icon={<Shield size={24} />} title={overviewDict.title} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-6">
        {navCards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.href)}
            className="bg-white rounded-lg shadow-md border border-gray-100 p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6 mt-2 mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
          <ChartNoAxesCombined size={24} className="text-cabgen-400" />
          <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
            {overviewDict.statistics}
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title={overviewDict.analysesByStatus}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [value, name]} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={overviewDict.topCountries}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} formatter={(val: number) => [val, overviewDict.count]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {countryData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={overviewDict.speciesBreakdown}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={speciesData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} formatter={(val: number) => [val, overviewDict.count]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {speciesData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminOverview;
