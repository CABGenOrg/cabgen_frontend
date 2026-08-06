"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAdminAnalysesQuery,
  useDeleteAdminAnalysisMutation,
} from "@/redux/services/admin/adminAnalysesService";
import type { AdminAnalysisResponse } from "@/redux/services/admin/adminAnalysesService";
import AdminAnalysisModal from "./AdminAnalysisModal";

const columnHelper = createColumnHelper<AdminAnalysisResponse>();

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
    analysis?: AdminAnalysisResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingAnalyses } = useGetAdminAnalysesQuery();
  const [deleteAnalysis, { isLoading: deleting, error: deleteError }] =
    useDeleteAdminAnalysisMutation();

  const handleDelete = async () => {
    try {
      await deleteAnalysis(modal.analysis?.id ?? "").unwrap();
      closeModal();
    } catch {}
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
    [adminDict, analysisDict, analysisTypeDict, lang, router],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Search size={24} />}
        title={adminDict.allAnalyses}
        actionLabel={analysisDict.newAnalysis}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingAnalyses}
        emptyMessage={adminDict.noAnalyses}
        countLabel={adminDict.showingAnalyses}
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
