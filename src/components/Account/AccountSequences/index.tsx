"use client";

import { useState, useMemo } from "react";
import { Upload, Pencil, Trash2, Dna, Eye } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetSamplesQuery,
  useDeleteSampleMutation,
} from "@/redux/services/samples/samplesService";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import SampleFormModal from "./SampleFormModal";
import UploadFormModal from "./UploadFormModal";
import AccountSampleModal from "../AccountSampleModal";

const columnHelper = createColumnHelper<SampleResponse>();

const AccountSequences = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.sequences;
  const genderDict = AccountDict.option.gender;
  const labOther = AccountDict.option.laboratory.other;
  const cityOther = AccountDict.option.city.other;
  const healthServiceOther = AccountDict.option.healthService.other;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | "viewSample" | null;
    sample?: SampleResponse;
  }>({ type: null });

  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingSamples } = useGetSamplesQuery(lang);
  const [deleteSample, { isLoading: deleting, error: deleteError }] =
    useDeleteSampleMutation();

  const handleDelete = async () => {
    try {
      await deleteSample(modal.sample?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 140,
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("microorganism", {
        header: dict.microorganism,
        size: 160,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[160px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("origin", {
        header: dict.origin,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sample_source", {
        header: dict.sampleSource,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sequencer", {
        header: dict.sequencer,
        size: 140,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("collection_date", {
        header: dict.collectionDate,
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
        header: dict.country,
        size: 80,
        meta: { responsive: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("city", {
        header: dict.city,
        size: 130,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[130px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("fastq1", {
        header: dict.fastq1,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fastq2", {
        header: dict.fastq2,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fasta", {
        header: dict.fasta,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 120,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={dict.uploadSequences}
              className="p-2 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "upload", sample: info.row.original })
              }
            >
              <Upload size={15} />
            </button>
            <button
              aria-label={dict.viewSample}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "viewSample", sample: info.row.original })
              }
            >
              <Eye size={15} />
            </button>
            <button
              aria-label={dict.editSample}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "edit", sample: info.row.original })
              }
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() =>
                setModal({ type: "delete", sample: info.row.original })
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict, lang],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Dna size={24} />}
        title={dict.title}
        actionLabel={dict.newSample}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingSamples}
        emptyMessage={dict.noResults}
        countLabel={dict.showing}
      />

      {modal.type === "add" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          genderDict={genderDict}
          labOther={labOther}
          cityOther={cityOther}
          healthServiceOther={healthServiceOther}
          errorsDict={Errors}
        />
      )}

      {modal.type === "edit" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          genderDict={genderDict}
          labOther={labOther}
          cityOther={cityOther}
          healthServiceOther={healthServiceOther}
          errorsDict={Errors}
          initial={modal.sample}
        />
      )}

      {modal.type === "upload" && (
        <UploadFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          errorsDict={Errors}
          sample={modal.sample ?? null}
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
        entityName={modal.sample?.name ?? ""}
        onDelete={handleDelete}
        deleting={deleting}
        error={
          typeof deleteError === "string" && deleteError === "internalServer"
            ? Errors[deleteError]
            : String(deleteError)
        }
        dict={{
          delete: dict.delete,
          cancel: dict.cancel,
          deleteConfirm: dict.deleteConfirm,
        }}
      />
    </div>
  );
};

export default AccountSequences;
