"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Pencil, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { downloadPostFile } from "@/utils/downloadFile";
import { ADMIN_ENDPOINTS } from "@/redux/services/admin/adminEndpoints";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAdminAnalysesQuery,
  useDeleteAdminAnalysisMutation,
} from "@/redux/services/admin/adminAnalysesService";
import type { AnalysisResponse } from "@/redux/services/analyses/analysesService";
import AdminAnalysisModal from "./AdminAnalysisModal";

const columnHelper = createColumnHelper<AnalysisResponse>();

const formatDate = (value: Date | string | null | undefined, lang: string) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString(lang, { timeZone: "UTC" });
};

const AdminAnalyses = () => {
  const router = useRouter();
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const analysisDict = AccountDict.analyses;
  const analysisTypeDict = AccountDict.option.analysis_type;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    analysis?: AnalysisResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingAnalyses } = useGetAdminAnalysesQuery(
    undefined,
    { pollingInterval: 30000 },
  );
  const [deleteAnalysis, { isLoading: deleting, error: deleteError }] =
    useDeleteAdminAnalysisMutation();

  const handleDelete = async () => {
    try {
      await deleteAnalysis(modal.analysis?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const hasRunning = data.some(
    (a) => a.status.toLowerCase() === "running",
  );

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState(false);

  const selectedIds = useMemo(
    () =>
      Object.keys(rowSelection)
        .filter((k) => rowSelection[k])
        .map((idx) => data[Number(idx)]?.id)
        .filter(Boolean) as string[],
    [rowSelection, data],
  );

  const handleDownloadTsv = async () => {
    if (!selectedIds.length || downloading) return;
    setDownloading(true);
    try {
      await downloadPostFile(
        ADMIN_ENDPOINTS.ANALYSES_DOWNLOAD_BATCH_TSVS,
        { ids: selectedIds },
        "analyses.tsv",
      );
    } catch {}
    setDownloading(false);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sample", {
        header: analysisDict.sample,
        size: 160,
        cell: (info) => (
          <span
            title={info.getValue()}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[160px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("user", {
        header: adminDict.user,
        size: 150,
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[150px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("type", {
        header: analysisDict.type,
        size: 120,
        cell: (info) => {
          const v = info.getValue();
          const typeKey = v.toLowerCase();
          return (analysisTypeDict as Record<string, string>)[typeKey] ?? v;
        },
      }),
      columnHelper.accessor("status", {
        header: analysisDict.status,
        size: 120,
        cell: (info) => {
          const v = info.getValue();
          const statusKey = v.toLowerCase();
          const label =
            (analysisDict.statusValues as Record<string, string>)[statusKey] ??
            v;
          return (
            <Badge
              variant={statusKey as "pending" | "running" | "done" | "failed"}
            >
              {label}
            </Badge>
          );
        },
      }),
      ...(hasRunning
        ? [
            columnHelper.accessor("step", {
              header: analysisDict.step,
              size: 120,
              cell: (info) => {
                const status = info.row.original.status;
                return status.toLowerCase() === "running"
                  ? (info.getValue() || "-")
                  : "-";
              },
            }),
          ]
        : []),
      columnHelper.accessor("started_at", {
        header: analysisDict.startedAt,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.accessor("finished_at", {
        header: analysisDict.finishedAt,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.accessor((row) => row.metrics?.coverage, {
        id: "coverage",
        header: analysisDict.coverage,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => {
          const v = info.getValue();
          return v === undefined || v === null ? "-" : String(v);
        },
      }),
      columnHelper.accessor((row) => row.metrics?.primary_species, {
        id: "identifiedSpecies",
        header: analysisDict.identifiedSpecies,
        size: 160,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[160px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: adminDict.actions,
        size: 110,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={analysisDict.view}
              className="p-2 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                router.push(`/account/analysis/${info.row.original.id}`)
              }
            >
              <Eye size={15} />
            </button>
            <button
              aria-label={adminDict.editAnalysis}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "edit", analysis: info.row.original })
              }
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={adminDict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() =>
                setModal({
                  type: "delete",
                  analysis: info.row.original,
                })
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [adminDict, analysisDict, analysisTypeDict, lang, router, hasRunning],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Search size={24} />}
        title={adminDict.allAnalyses}
        actionLabel={analysisDict.newAnalysis}
        onAction={() => setModal({ type: "add" })}
      />

      <div className="flex justify-start mb-4">
        <Button
          variant="outline"
          disabled={selectedIds.length === 0 || downloading}
          onClick={handleDownloadTsv}
          className="flex items-center gap-1.5"
        >
          <Download size={16} />
          {adminDict.downloadTsv}
          {selectedIds.length > 0 && ` (${selectedIds.length})`}
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loadingAnalyses}
        emptyMessage={adminDict.noAnalyses}
        countLabel={adminDict.showingAnalyses}
        enableRowSelection={(row) =>
          row.original.status.toLowerCase() === "done" &&
          row.original.type.toLowerCase() !== "fastqc"
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        maxSelection={50}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminAnalysisModal
          open
          onClose={closeModal}
          initial={modal.analysis}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.analysis?.sample ?? ""}
        onDelete={handleDelete}
        deleting={deleting}
        error={
          typeof deleteError === "string" && deleteError === "internalServer"
            ? Errors[deleteError]
            : String(deleteError)
        }
        dict={{
          delete: adminDict.delete,
          cancel: adminDict.cancel,
          deleteConfirm: adminDict.deleteConfirm,
        }}
      />
    </div>
  );
};

export default AdminAnalyses;
