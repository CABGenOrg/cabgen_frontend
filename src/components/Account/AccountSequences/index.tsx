"use client";

import { useState, useEffect, useMemo } from "react";
import { Upload, Pencil, Trash2, Dna, Eye, Download } from "lucide-react";
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
import { SAMPLES_ENDPOINTS } from "@/redux/services/samples/samplesEndpoints";
import {
  useGetSamplesQuery,
  useDeleteSampleMutation,
  useCreateSamplesFromTableMutation,
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

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | "viewSample" | "table" | null;
    sample?: SampleResponse;
  }>({ type: null });

  const closeModal = () => setModal({ type: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: paged, isLoading: loadingSamples } = useGetSamplesQuery({
    input: debouncedSearch,
    lang,
    page,
  });
  const data = paged?.data ?? [];
  const totalPages = paged?.total_pages ?? 1;

  const handleSearch = (value: string) => {
    setPage(1);
    setDebouncedSearch(value);
  };

  useEffect(() => {
    if (!loadingSamples && data.length === 0 && page > totalPages)
      setPage(Math.max(1, totalPages));
  }, [loadingSamples, data.length, page, totalPages]);

  const [createSamplesFromTable] = useCreateSamplesFromTableMutation();
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [tableMsg, setTableMsg] = useState<{ text: string; n: number } | null>(
    null,
  );

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true);
    try {
      await downloadGetFile(
        SAMPLES_ENDPOINTS.TEMPLATE,
        "cabgen_samples_template.xlsx",
      );
    } catch {
      toast({ description: Errors.downloadError, variant: "destructive" });
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleTableSubmit = async (fd: FormData) => {
    const msg = await createSamplesFromTable(fd).unwrap();
    setTableMsg((prev) => ({ text: msg, n: (prev?.n ?? 0) + 1 }));
    return msg;
  };

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
      columnHelper.accessor("origin_code", {
        header: dict.originCode,
        size: 110,
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("in_network", {
        header: dict.network,
        size: 85,
        cell: (info) => {
          const inNetwork = info.getValue();
          return (
            <Badge variant={inNetwork ? "done" : "failed"}>
              {inNetwork
                ? AccountDict.admin.activeValues.yes
                : AccountDict.admin.activeValues.no}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("microorganism", {
        header: dict.microorganism,
        size: 130,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("origin", {
        header: dict.origin,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sample_source", {
        header: dict.sampleSource,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("fastq1", {
        header: dict.fastq1,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fastq2", {
        header: dict.fastq2,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fasta", {
        header: dict.fasta,
        size: 85,
        meta: { responsive: "hidden 2xl:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 100,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <IconButton
              variant="primary"
              label={dict.uploadSequences}
              icon={<Upload size={18} />}
              onClick={() =>
                setModal({ type: "upload", sample: info.row.original })
              }
            />
            <IconButton
              label={dict.viewSample}
              icon={<Eye size={18} />}
              onClick={() =>
                setModal({ type: "viewSample", sample: info.row.original })
              }
            />
            <IconButton
              label={dict.editSample}
              icon={<Pencil size={18} />}
              onClick={() =>
                setModal({ type: "edit", sample: info.row.original })
              }
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() =>
                setModal({ type: "delete", sample: info.row.original })
              }
            />
          </div>
        ),
      }),
    ],
    [dict],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Dna size={24} />}
        title={dict.title}
        actionLabel={dict.newSample}
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
          {dict.downloadTemplate}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setModal({ type: "table" })}
        >
          <Upload size={16} className="mr-2" />
          {dict.uploadTable}
        </Button>
      </div>

      {tableMsg && (
        <Message key={tableMsg.n} msg={tableMsg.text} type="success" />
      )}

      <SearchInput onSearch={handleSearch} placeholder={dict.search} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingSamples}
        emptyMessage={dict.noResults}
        countLabel={dict.showing}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {modal.type === "add" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          errorsDict={Errors}
        />
      )}

      {modal.type === "edit" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
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

      {modal.type === "table" && (
        <UploadTableModal
          open
          onClose={closeModal}
          onSubmit={handleTableSubmit}
          errorsDict={Errors}
          dict={{
            title: dict.uploadTableTitle,
            hint: dict.uploadTableHint,
            fileLabel: dict.uploadTableFile,
            required: dict.validation.required,
            cancel: dict.cancel,
            submit: dict.upload,
            selectPlaceholder: dict.selectPlaceholder,
          }}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.sample?.origin_code ?? ""}
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
