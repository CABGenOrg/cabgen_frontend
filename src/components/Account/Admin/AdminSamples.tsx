"use client";

import { useState, useMemo } from "react";
import { Dna, Pencil, Trash2, Upload, Eye } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import SearchInput from "@/components/General/SearchInput";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import IconButton from "@/components/General/IconButton";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAdminSamplesQuery,
  useDeleteAdminSampleMutation,
} from "@/redux/services/admin/adminSamplesService";
import { useGetSamplesQuery } from "@/redux/services/samples/samplesService";
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
  const cityOther = AccountDict.option.city.other;
  const sequencerOther = AccountDict.option.sequencer.other;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | "viewSample" | null;
    sample?: SampleResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data: fullData = [], isLoading: loadingSamples } = useGetAdminSamplesQuery(lang);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchData = [] } = useGetSamplesQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });
  const data = debouncedSearch ? searchData : fullData;
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
      columnHelper.accessor("origin_code", {
        header: seqDict.originCode,
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
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue() === "option.sequencer.other" ? sequencerOther : (info.getValue() || "-")}</span>,
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
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[130px]">{info.getValue() === "Other" ? cityOther : (info.getValue() || "-")}</span>,
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
            <IconButton
              variant="primary"
              label={seqDict.uploadSequences}
              icon={<Upload size={18} />}
              onClick={() =>
                setModal({ type: "upload", sample: info.row.original })
              }
            />
            <IconButton
              label={seqDict.viewSample}
              icon={<Eye size={18} />}
              onClick={() =>
                setModal({ type: "viewSample", sample: info.row.original })
              }
            />
            <IconButton
              label={adminDict.editSample}
              icon={<Pencil size={18} />}
              onClick={() => setModal({ type: "edit", sample: info.row.original })}
            />
            <IconButton
              variant="danger"
              label={adminDict.delete}
              icon={<Trash2 size={18} />}
              onClick={() => setModal({ type: "delete", sample: info.row.original })}
            />
          </div>
        ),
      }),
    ],
    [adminDict, seqDict, lang, cityOther, sequencerOther],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Dna size={24} />}
        title={adminDict.allSamples}
        actionLabel={adminDict.newSample}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} placeholder={adminDict.search} />

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
        entityName={modal.sample?.origin_code || ""}
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
