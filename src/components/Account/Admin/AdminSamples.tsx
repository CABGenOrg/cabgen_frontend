"use client";

import { useState, useMemo } from "react";
import { Dna, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAdminSamplesQuery,
  useDeleteAdminSampleMutation,
} from "@/redux/services/admin/adminSamplesService";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import AdminSampleModal from "./AdminSampleModal";
import AdminUploadFormModal from "./AdminUploadFormModal";
import AccountSampleModal from "../AccountSampleModal";

const columnHelper = createColumnHelper<SampleResponse>();

const AdminSamples = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const seqDict = AccountDict.sequences;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | "viewSample" | null;
    sample?: SampleResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingSamples } = useGetAdminSamplesQuery(lang);
  const [deleteSample, { isLoading: deleting, error: deleteError }] =
    useDeleteAdminSampleMutation();

  const handleDelete = async () => {
    try {
      await deleteSample(modal.sample?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: adminDict.name,
        size: 140,
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("user", {
        header: adminDict.user,
        size: 150,
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[150px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("microorganism", {
        header: seqDict.microorganism,
        size: 160,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[160px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("origin", {
        header: seqDict.origin,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sample_source", {
        header: seqDict.sampleSource,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sequencer", {
        header: seqDict.sequencer,
        size: 140,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("collection_date", {
        header: seqDict.collectionDate,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => {
          const v = info.getValue();
          if (!v) return "-";
          const d = v instanceof Date ? v : new Date(v);
          return isNaN(d.getTime()) ? "-" : d.toLocaleDateString(lang, { timeZone: "UTC" });
        },
      }),
      columnHelper.accessor("country_code", {
        header: seqDict.country,
        size: 80,
        meta: { responsive: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("city", {
        header: seqDict.city,
        size: 130,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[130px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("fastq1", {
        header: seqDict.fastq1,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fastq2", {
        header: seqDict.fastq2,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fasta", {
        header: seqDict.fasta,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: adminDict.actions,
        size: 120,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={seqDict.uploadSequences}
              className="p-2 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "upload", sample: info.row.original })
              }
            >
              <Upload size={15} />
            </button>
            <button
              aria-label={seqDict.viewSample}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "viewSample", sample: info.row.original })
              }
            >
              <Eye size={15} />
            </button>
            <button
              aria-label={adminDict.editSample}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() => setModal({ type: "edit", sample: info.row.original })}
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={adminDict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() => setModal({ type: "delete", sample: info.row.original })}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [adminDict, seqDict, lang],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Dna size={24} />}
        title={adminDict.allSamples}
        actionLabel={adminDict.newSample}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingSamples}
        emptyMessage={adminDict.noSamples}
        countLabel={adminDict.showingSamples}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminSampleModal
          open
          onClose={closeModal}
          initial={modal.sample}
          errorsDict={Errors}
        />
      )}

      {modal.type === "upload" && (
        <AdminUploadFormModal
          open
          onClose={closeModal}
          sample={modal.sample ?? null}
          errorsDict={Errors}
        />
      )}

      {modal.type === "viewSample" && modal.sample && (
        <AccountSampleModal
          open
          onClose={closeModal}
          sample={modal.sample}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.sample?.name || ""}
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

export default AdminSamples;
