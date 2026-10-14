"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/AuthContext";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Loading from "../General/Loading";
import { User2, LayoutDashboard, Dna, Search, CheckCircle } from "lucide-react";
import { useGetAnalysesQuery } from "@/redux/services/analyses/analysesService";
import { useGetSamplesQuery } from "@/redux/services/samples/samplesService";
import { useGetUserMetricsQuery } from "@/redux/services/metrics/metricsService";

const OverviewCharts = dynamic(() => import("./OverviewCharts"), {
  loading: () => (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-card rounded-lg shadow-md border border-border p-5 h-[362px] animate-pulse"
        />
      ))}
    </div>
  ),
});

const COLORS = {
  pending: "#FCD34D",
  running: "#60A5FA",
  done: "#34D399",
  failed: "#F87171",
  type: ["#0A6354", "#59A5D8", "#34B290"],
};

const BAR_COLORS = ["#0A6354", "#59A5D8", "#34B290", "#F59E0B", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16", "#A855F7"];

const fmtMin = (v: number) => (v < 1 ? "<1" : String(Math.round(v)));

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
}> = ({ icon, value, label, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-card rounded-lg shadow-md border border-border p-5 flex items-center gap-4 ${onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
  >
    <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

const Overview = () => {
  const { user, isLoading: authLoading } = useAuth();
  const lang = useLanguage();
  const router = useRouter();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const overviewDict = AccountDict.overview;
  const fmtDur = (v: number) =>
    v < 1 || Math.round(v) === 1
      ? `${v < 1 ? "<1" : "1"} ${overviewDict.minute}`
      : `${Math.round(v)} ${overviewDict.minutes}`;
  const statusValues = AccountDict.analyses.statusValues;
  const analysisTypeDict = AccountDict.option.analysis_type;

  const { data: analysesPaged, isLoading: analysesLoading } =
    useGetAnalysesQuery({});
  const analyses = analysesPaged?.data ?? [];
  const { data: samplesPaged, isLoading: samplesLoading } =
    useGetSamplesQuery({ input: "", lang });
  const samples = samplesPaged?.data ?? [];

  const { data: metrics, isLoading: metricsLoading } =
    useGetUserMetricsQuery();

  const statusData = useMemo(() => {
    const statusColors: Record<string, string> = {
      pending: COLORS.pending,
      running: COLORS.running,
      done: COLORS.done,
      failed: COLORS.failed,
    };
    return Object.entries(metrics?.analyses_by_status ?? {})
      .filter(([, value]) => value > 0)
      .map(([key, value]) => {
        const lower = key.toLowerCase();
        return {
          name:
            (statusValues as Record<string, string>)[lower] ?? key,
          value,
          fill: statusColors[lower] ?? COLORS.failed,
        };
      });
  }, [metrics, statusValues]);

  const typeData = useMemo(() => {
    const analysisTypeDict = AccountDict.option
      .analysis_type as Record<string, string>;
    return (metrics?.analyses_by_type ?? [])
      .filter((t) => t.count > 0)
      .map((t, i) => ({
        name: analysisTypeDict[t.type.toLowerCase()] ?? t.type,
        value: t.count,
        fill: COLORS.type[i % COLORS.type.length],
      }));
  }, [metrics, AccountDict.option.analysis_type]);

  const speciesData = useMemo(() => {
    const all = (metrics?.top_species ?? []).filter((s) => s.count > 0);
    const top10 = all.slice(0, 10);
    const othersCount = all.slice(10).reduce((sum, s) => sum + s.count, 0);
    return [
      ...top10.map((s, i) => ({
        name: s.species,
        value: s.count,
        fill: BAR_COLORS[i % BAR_COLORS.length],
      })),
      ...(othersCount > 0
        ? [
            {
              name: overviewDict.others ?? "Outros",
              value: othersCount,
              fill: BAR_COLORS[10],
            },
          ]
        : []),
    ];
  }, [metrics, overviewDict.others]);

  const geneData = useMemo(() => {
    return (metrics?.top_resistance_genes ?? [])
      .filter((g) => g.count > 0)
      .slice(0, 10)
      .map((g, i) => ({
        name: g.gene.split(" ")[0],
        value: g.count,
        fill: BAR_COLORS[i % BAR_COLORS.length],
      }));
  }, [metrics]);

  const durationData = useMemo(() => {
    return (metrics?.analyses_by_type ?? [])
      .filter((t) => t.count > 0)
      .map((t) => ({
        name:
          (AccountDict.option.analysis_type as Record<string, string>)[
            t.type.toLowerCase()
          ] ?? t.type,
        avg: t.avg_duration_seconds / 60,
        p95: t.p95_duration_seconds / 60,
      }));
  }, [metrics, AccountDict.option.analysis_type]);

  const monthData = useMemo(() => {
    return (metrics?.samples_by_month ?? []).map((m) => {
      const d = new Date(`${m.month}-01T00:00:00Z`);
      return {
        name: isNaN(d.getTime())
          ? m.month
          : d.toLocaleDateString(lang, {
              month: "short",
              year: "2-digit",
              timeZone: "UTC",
            }),
        value: m.count,
      };
    });
  }, [metrics, lang]);

  if (authLoading || analysesLoading || samplesLoading || metricsLoading)
    return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-cabgen-400" size={24} />
        <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
          {overviewDict.title}
        </span>
      </h1>

      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cabgen-400 flex items-center justify-center shrink-0">
            <User2 size={32} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-medium">
              {overviewDict.welcome}, {user?.username}
            </p>
            <p className="text-muted-foreground truncate">
              {(AccountDict.admin.roleValues as Record<string, string>)[
                user?.user_role ?? ""
              ] ?? user?.user_role}
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<Dna size={24} />}
          value={samples.length}
          label={overviewDict.totalSamples}
          onClick={() => router.push("/account/sequences")}
        />
        <StatCard
          icon={<Search size={24} />}
          value={analyses.length}
          label={overviewDict.totalAnalyses}
          onClick={() => router.push("/account/analysis")}
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          value={analyses.filter((a) => a.status === "DONE").length}
          label={overviewDict.analysesDone}
          onClick={() => router.push("/account/analysis")}
        />
      </div>

      <OverviewCharts
        statusData={statusData}
        typeData={typeData}
        speciesData={speciesData}
        geneData={geneData}
        durationData={durationData}
        monthData={monthData}
        fmtMin={fmtMin}
        fmtDur={fmtDur}
        titles={{
          byStatus: overviewDict.byStatus,
          byType: overviewDict.byType,
          topSpecies: overviewDict.topSpecies,
          count: overviewDict.count,
          topResistanceGenes: overviewDict.topResistanceGenes,
          duration: overviewDict.duration,
          avgDuration: overviewDict.avgDuration,
          p95Duration: overviewDict.p95Duration,
          samplesByMonth: overviewDict.samplesByMonth,
        }}
      />
    </div>
  );
};

export default Overview;
