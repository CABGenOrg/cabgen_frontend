"use client";

import React from "react";
import dynamic from "next/dynamic";
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
  ScrollText,
  ChartNoAxesCombined,
} from "lucide-react";
import PageHeader from "@/components/General/PageHeader";
import Loading from "@/components/General/Loading";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAdminMetricsQuery,
  type NetworkMetric,
  type MonthMetric,
  type QueueWaitMetric,
} from "@/redux/services/admin/adminMetricsService";

const AdminOverviewCharts = dynamic(
  () => import("./AdminOverviewCharts"),
  {
    loading: () => (
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div
            key={i}
            className="bg-card rounded-lg shadow-md border border-border p-5 h-[362px] animate-pulse"
          />
        ))}
      </div>
    ),
  },
);

const fmtMin = (v: number) => (v < 1 ? "<1" : String(Math.round(v)));

const STATUS_COLORS: Record<string, string> = {
  pending: "#FCD34D",
  running: "#60A5FA",
  done: "#34D399",
  failed: "#F87171",
};

const BAR_COLORS = ["#0A6354", "#59A5D8", "#34B290", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16", "#A855F7"];

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
}> = ({ icon, value, label }) => (
  <div className="bg-card rounded-lg shadow-md border border-border p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-3xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
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
  const fmtDur = (v: number) =>
    v < 1 || Math.round(v) === 1
      ? `${v < 1 ? "<1" : "1"} ${overviewDict.minute}`
      : `${Math.round(v)} ${overviewDict.minutes}`;
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
    { icon: <ScrollText size={24} />, title: dict.audit.title, href: "/account/admin/audit" },
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
    .slice(0, 10)
    .map((c, i) => ({
      name: c.country,
      value: c.count,
      fill: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const allSpecies = (metrics?.species_breakdown ?? []).filter((s) => s.count > 0);
  const top10Species = allSpecies.slice(0, 10);
  const othersCount = allSpecies.slice(10).reduce((sum, s) => sum + s.count, 0);
  const speciesData = [
    ...top10Species.map((s, i) => ({
      name: s.species,
      value: s.count,
      fill: BAR_COLORS[i % BAR_COLORS.length],
    })),
    ...(othersCount > 0
      ? [{ name: overviewDict.others, value: othersCount, fill: BAR_COLORS[10] }]
      : []),
  ];

  const analysisTypeDict = AccountDict.option.analysis_type as Record<
    string,
    string
  >;
  const byType = (metrics?.analyses_by_type ?? []).filter(
    (t) => t.count > 0,
  );
  const typeData = byType.map((t, i) => ({
    name: analysisTypeDict[t.type.toLowerCase()] ?? t.type,
    value: t.count,
    fill: BAR_COLORS[i % BAR_COLORS.length],
  }));
  const durationData = byType.map((t) => ({
    name: analysisTypeDict[t.type.toLowerCase()] ?? t.type,
    avg: t.avg_duration_seconds / 60,
    p95: t.p95_duration_seconds / 60,
  }));

  const networkData = (m?: NetworkMetric) =>
    m
      ? [
          {
            name: AccountDict.admin.activeValues.yes,
            value: m.in_network,
            fill: "#16a34a",
          },
          {
            name: AccountDict.admin.activeValues.no,
            value: m.out_network,
            fill: "#dc2626",
          },
        ].filter((d) => d.value > 0)
      : [];
  const samplesNetworkData = networkData(metrics?.samples_by_network);
  const usersNetworkData = networkData(metrics?.users_by_network);

  const geneData = (metrics?.top_resistance_genes ?? [])
    .filter((g) => g.count > 0)
    .slice(0, 10)
    .map((g, i) => ({
      name: g.gene.split(" ")[0],
      value: g.count,
      fill: BAR_COLORS[i % BAR_COLORS.length],
    }));

  const formatMonth = (m: MonthMetric) => {
    const d = new Date(`${m.month}-01T00:00:00Z`);
    return isNaN(d.getTime())
      ? m.month
      : d.toLocaleDateString(lang, {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        });
  };
  const monthData = (metrics?.samples_by_month ?? []).map((m) => ({
    name: formatMonth(m),
    value: m.count,
  }));
  const queueData = metrics?.queue_wait
    ? [
        {
          name: overviewDict.avgWait,
          value: metrics.queue_wait.avg_seconds / 60,
          fill: "#0A6354",
        },
        {
          name: "P95",
          value: metrics.queue_wait.p95_seconds / 60,
          fill: "#F59E0B",
        },
      ]
    : [];

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
            className="bg-card rounded-lg shadow-md border border-border p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-6 mt-2 mb-6">
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

      <AdminOverviewCharts
        statusData={statusData}
        typeData={typeData}
        durationData={durationData}
        queueData={queueData}
        countryData={countryData}
        speciesData={speciesData}
        geneData={geneData}
        monthData={monthData}
        samplesNetworkData={samplesNetworkData}
        usersNetworkData={usersNetworkData}
        fmtMin={fmtMin}
        fmtDur={fmtDur}
        titles={{
          analysesByStatus: overviewDict.analysesByStatus,
          count: overviewDict.count,
          analysesByType: overviewDict.analysesByType,
          duration: overviewDict.duration,
          avgDuration: overviewDict.avgDuration,
          p95Duration: overviewDict.p95Duration,
          queueWait: overviewDict.queueWait,
          avgWait: overviewDict.avgWait,
          topCountries: overviewDict.topCountries,
          speciesBreakdown: overviewDict.speciesBreakdown,
          topResistanceGenes: overviewDict.topResistanceGenes,
          samplesByMonth: overviewDict.samplesByMonth,
          samplesInNetwork: overviewDict.samplesInNetwork,
          usersInNetwork: overviewDict.usersInNetwork,
        }}
      />
    </div>
  );
};

export default AdminOverview;
