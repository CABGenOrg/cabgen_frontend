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

const OverviewCharts = dynamic(() => import("./OverviewCharts"), {
  loading: () => (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md border border-gray-100 p-5 h-[362px] animate-pulse"
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

const topSpecies = (analyses: { status: string; metrics?: { primary_species?: string } | null }[], othersLabel: string) => {
  const counts: Record<string, number> = {};
  let total = 0;
  analyses.forEach((a) => {
    const species = a.status.toLowerCase() === "done" ? a.metrics?.primary_species : undefined;
    if (!species) return;
    counts[species] = (counts[species] ?? 0) + 1;
    total += 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const topTotal = sorted.reduce((sum, [, v]) => sum + v, 0);
  if (total > topTotal) {
    sorted.push([othersLabel, total - topTotal]);
  }
  return sorted.map(([name, value], i) => ({ name, value, fill: BAR_COLORS[i % BAR_COLORS.length] }));
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
}> = ({ icon, value, label, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-lg shadow-md border border-gray-100 p-5 flex items-center gap-4 ${onClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""}`}
  >
    <div className="w-12 h-12 rounded-full bg-cabgen-100 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
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
  const statusValues = AccountDict.analyses.statusValues;
  const analysisTypeDict = AccountDict.option.analysis_type;

  const { data: analyses = [], isLoading: analysesLoading } = useGetAnalysesQuery({});
  const { data: samples = [], isLoading: samplesLoading } = useGetSamplesQuery("");

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    analyses.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    const statusColors: Record<string, string> = {
      pending: COLORS.pending,
      running: COLORS.running,
      done: COLORS.done,
      failed: COLORS.failed,
    };
    return Object.entries(counts).map(([name, value]) => {
      const key = name.toLowerCase();
      return {
        name: (statusValues as Record<string, string>)[key] ?? name,
        value,
        fill: statusColors[key] ?? COLORS.failed,
      };
    });
  }, [analyses, statusValues]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    analyses.forEach((a) => {
      counts[a.type] = (counts[a.type] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value], i) => ({
      name:
        (analysisTypeDict as Record<string, string>)[name.toLowerCase()] ??
        name,
      value,
      fill: COLORS.type[i % COLORS.type.length],
    }));
  }, [analyses, analysisTypeDict]);

  const speciesData = useMemo(() => topSpecies(analyses, overviewDict.others ?? "Other"), [analyses, overviewDict.others]);

  if (authLoading || analysesLoading || samplesLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <LayoutDashboard className="text-cabgen-400" size={24} />
        <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
          {overviewDict.title}
        </span>
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-cabgen-400 flex items-center justify-center shrink-0">
            <User2 size={32} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-medium">
              {overviewDict.welcome}, {user?.username}
            </p>
            <p className="text-gray-500 truncate">{user?.user_role}</p>
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
        titles={{
          byStatus: overviewDict.byStatus,
          byType: overviewDict.byType,
          topSpecies: overviewDict.topSpecies,
          count: overviewDict.count,
        }}
      />
    </div>
  );
};

export default Overview;
