"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { baseUrl } from "@/utils/handleRequest";
import { section_btn } from "@/styles/tailwind_classes";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Loading from "@/components/General/Loading";
import Message from "@/components/General/Message";
import { useGetAdminAnalysisByIDQuery } from "@/redux/services/admin/adminAnalysesService";
import { ANALYSES_ENDPOINTS } from "@/redux/services/analyses/analysesEndpoints";

const formatValue = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "";
  return String(value);
};

const MetricsSection: React.FC<{
  title: string;
  rows: { label: string; value: unknown }[];
}> = ({ title, rows }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-6">
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
      <h2 className="font-semibold text-gray-900">{title}</h2>
    </div>
    <table className="w-full text-sm">
      <tbody>
        {rows.map(({ label, value }) => {
          const formatted = formatValue(value);
          return (
            <tr key={label} className="border-b border-gray-100 last:border-0">
              <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap bg-gray-50/50 w-1/3">
                {label}
              </th>
              <td className="px-4 py-3 text-gray-900 break-words">
                {formatted || "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const AccountAnalysisDetail = () => {
  const router = useRouter();
  const lang = useLanguage();
  const params = useParams();
  const id = params.id as string;

  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.analyses;
  const detailDict = dict.detail;
  const metricsDict = detailDict.metrics;
  const analysisTypeDict = AccountDict.option.analysis_type;

  const { data: analysis, isLoading, error } = useGetAdminAnalysisByIDQuery(id);

  const { genomicRows, speciesRows, virulenceRows } = useMemo(() => {
    if (!analysis?.metrics) {
      return { genomicRows: [], speciesRows: [], virulenceRows: [] };
    }
    const m = analysis.metrics;
    return {
      genomicRows: [
        {
          label: metricsDict.completeness,
          value:
            m.completeness != null ? Number(m.completeness).toFixed(2) : "—",
        },
        {
          label: metricsDict.n50,
          value:
            m.n50 != null ? `${Number(m.n50).toLocaleString(lang)} bp` : "—",
        },
        {
          label: metricsDict.genomeSize,
          value:
            m.genome_size != null
              ? `${Number(m.genome_size).toLocaleString(lang)} bp`
              : "—",
        },
        {
          label: metricsDict.coverage,
          value: m.coverage != null ? Number(m.coverage).toFixed(2) : "—",
        },
        {
          label: metricsDict.contamination,
          value:
            m.contamination != null ? Number(m.contamination).toFixed(2) : "—",
        },
      ],
      speciesRows: [
        { label: metricsDict.identifiedSpecies, value: m.primary_species },
        { label: metricsDict.secondarySpecies, value: m.secondary_species },
        { label: metricsDict.mlst, value: m.mlst },
      ],
      virulenceRows: [
        { label: metricsDict.vfdb, value: m.vfdb },
        { label: metricsDict.poliMutations, value: m.poli_mutations },
        { label: metricsDict.otherMutations, value: m.other_mutations },
        { label: metricsDict.gene, value: m.gene },
        { label: metricsDict.resfinder, value: m.resfinder },
        { label: metricsDict.plasmid, value: m.plasmid },
      ],
    };
  }, [analysis?.metrics, metricsDict, lang]);

  const statusLabel =
    (dict.statusValues as Record<string, string>)[
      analysis?.status.toLowerCase() ?? ""
    ] ?? analysis?.status;

  const typeLabel =
    (analysisTypeDict as Record<string, string>)[
      analysis?.type.toLowerCase() ?? ""
    ] ?? analysis?.type;

  const zipUrl =
    analysis?.results_zip_path && analysis?.status.toLowerCase() === "done"
      ? `${baseUrl}${ANALYSES_ENDPOINTS.DEFAULT}/${id}/download/zip`
      : null;

  const fastqcReady = analysis?.status.toLowerCase() === "done";
  const fastqc1Url = fastqcReady
    ? `${baseUrl}${ANALYSES_ENDPOINTS.DEFAULT}/${id}/fastqc1`
    : null;
  const fastqc2Url = fastqcReady
    ? `${baseUrl}${ANALYSES_ENDPOINTS.DEFAULT}/${id}/fastqc2`
    : null;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-16">
        <Loading />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="w-full">
        <button
          onClick={() => router.push("/account/analysis")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cabgen-200 mb-4"
        >
          <ArrowLeft size={16} /> {detailDict.back}
        </button>
        <Message msg={error ? String(error) : detailDict.title} type="error" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => router.push("/account/analysis")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cabgen-200 mb-4"
      >
        <ArrowLeft size={16} /> {detailDict.back}
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            {analysis.sample || detailDict.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{typeLabel}</span>
            <Badge
              variant={
                analysis.status.toLowerCase() as
                  | "pending"
                  | "running"
                  | "done"
                  | "failed"
              }
            >
              {statusLabel}
            </Badge>
          </div>
        </div>
        {zipUrl && (
          <a
            href={zipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${section_btn} inline-flex items-center justify-center gap-1.5 shrink-0`}
          >
            <Download size={18} />
            {detailDict.downloadResults}
          </a>
        )}
      </div>

      {analysis.error_message && (
        <div className="mb-5">
          <Message msg={analysis.error_message} type="error" />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900">{detailDict.fastqc}</h2>
        </div>
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          {fastqc1Url && analysis.fastqc1 ? (
            <a
              href={fastqc1Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cabgen-200 hover:text-cabgen-300 hover:underline"
            >
              <ExternalLink size={16} />
              {detailDict.fastqc1}
            </a>
          ) : (
            <span className="text-gray-400">{detailDict.fastqc1} —</span>
          )}
          {fastqc2Url && analysis.fastqc2 ? (
            <a
              href={fastqc2Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-cabgen-200 hover:text-cabgen-300 hover:underline"
            >
              <ExternalLink size={16} />
              {detailDict.fastqc2}
            </a>
          ) : (
            <span className="text-gray-400">{detailDict.fastqc2} —</span>
          )}
        </div>
      </div>

      <MetricsSection title={detailDict.genomic} rows={genomicRows} />
      <MetricsSection title={detailDict.species} rows={speciesRows} />
      <MetricsSection title={detailDict.virulence} rows={virulenceRows} />
    </div>
  );
};

export default AccountAnalysisDetail;
