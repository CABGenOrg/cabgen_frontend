"use client";

import { useState, useEffect, useMemo } from "react";
import { Dna, Pencil, Trash2, Upload, Eye, Download } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import SearchInput from "@/components/General/SearchInput";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import IconButton from "@/components/General/IconButton";
import Message from "@/components/General/Message";
import UploadTableModal from "@/components/General/UploadTableModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { toast } from "@/hooks/use-toast";
import { downloadGetFile } from "@/utils/downloadFile";
import { ADMIN_ENDPOINTS } from "@/redux/services/admin/adminEndpoints";
import {
  useGetAdminSamplesQuery,
  useDeleteAdminSampleMutation,
  useCreateAdminSamplesFromTableMutation,
} from "@/redux/services/admin/adminSamplesService";
import { useGetSamplesQuery } from "@/redux/services/samples/samplesService";
import { useGetUsersQuery } from "@/redux/services/admin/adminUsersService";
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
    type: "add" | "edit" | "upload" | "delete" | "viewSample" | "table" | null;
    sample?: SampleResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const [page, setPage] = useState(1);
  const { data: fullPaged, isLoading: loadingSamples } =
    useGetAdminSamplesQuery({ lang, page });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchPaged, isLoading: searchLoading } = useGetSamplesQuery(
    { input: debouncedSearch, lang, page },
    {
      skip: !debouncedSearch,
    },
  );
  const fullData = fullPaged?.data ?? [];
  const searchData = searchPaged?.data ?? [];
  const data = debouncedSearch ? searchData : fullData;
  const totalPages =
    (debouncedSearch ? searchPaged : fullPaged)?.total_pages ?? 1;
  const tableLoading = debouncedSearch ? searchLoading : loadingSamples;

  const handleSearch = (value: string) => {
    setPage(1);
    setDebouncedSearch(value);
  };

  useEffect(() => {
    if (!tableLoading && data.length === 0 && page > totalPages)
      setPage(Math.max(1, totalPages));
  }, [tableLoading, data.length, page, totalPages]);

  const { data: usersPaged } = useGetUsersQuery({ input: "" });
  const users = usersPaged?.data;
  const userOptions = useMemo(
    () =>
      (users ?? [])
        .map((u) => ({ value: u.id, label: u.name }))
        .sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
        ),
    [users],
  );

  const [createAdminSamplesFromTable] = useCreateAdminSamplesFromTableMutation();
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [tableMsg, setTableMsg] = useState<{ text: string; n: number } | null>(
    null,
  );

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      await downloadGetFile(
        `${ADMIN_ENDPOINTS.SAMPLES}/download/template`,
        "cabgen_samples_template.xlsx",
      );
    } catch {
      toast({ description: Errors.downloadError, variant: "destructive" });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleTableSubmit = async (fd: FormData) => {
    const msg = await createAdminSamplesFromTable(fd).unwrap();
    setTableMsg((prev) => ({ text: msg, n: (prev?.n ?? 0) + 1 }));
    return msg;
  };

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
        size: 110,
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("in_network", {
        header: adminDict.network,
        size: 85,
        cell: (info) => {
          const inNetwork = info.getValue();
          return (
            <Badge variant={inNetwork ? "done" : "failed"}>
              {inNetwork ? adminDict.activeValues.yes : adminDict.activeValues.no}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("user", {
        header: adminDict.user,
        size: 120,
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("microorganism", {
        header: seqDict.microorganism,
        size: 130,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("origin", {
        header: seqDict.origin,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sample_source", {
        header: seqDict.sampleSource,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("fastq1", {
        header: seqDict.fastq1,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fastq2", {
        header: seqDict.fastq2,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fasta", {
        header: seqDict.fasta,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: adminDict.actions,
        size: 100,
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
    [adminDict, seqDict],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Dna size={24} />}
        title={adminDict.allSamples}
        actionLabel={adminDict.newSample}
        onAction={() => setModal({ type: "add" })}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          disabled={downloadingTemplate}
        >
          <Download size={16} className="mr-2" />
          {seqDict.downloadTemplate}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setModal({ type: "table" })}
        >
          <Upload size={16} className="mr-2" />
          {seqDict.uploadTable}
        </Button>
      </div>

      {tableMsg && (
        <Message key={tableMsg.n} msg={tableMsg.text} type="success" />
      )}

      <SearchInput onSearch={handleSearch} placeholder={adminDict.search} />

      <DataTable
        data={data}
        columns={columns}
        loading={tableLoading}
        emptyMessage={adminDict.noSamples}
        countLabel={adminDict.showingSamples}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
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

      {modal.type === "table" && (
        <UploadTableModal
          open
          onClose={closeModal}
          onSubmit={handleTableSubmit}
          errorsDict={Errors}
          dict={{
            title: seqDict.uploadTableTitle,
            hint: seqDict.uploadTableHint,
            fileLabel: seqDict.uploadTableFile,
            required: seqDict.validation.required,
            cancel: seqDict.cancel,
            submit: seqDict.upload,
            selectPlaceholder: seqDict.selectPlaceholder,
            userLabel: adminDict.user,
            userOptions,
          }}
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
