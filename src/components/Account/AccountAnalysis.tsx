"use client";

import { useState, useMemo } from "react";
import { Plus, Eye, Trash2, Search, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import IconButton from "@/components/General/IconButton";
import { label_class } from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { SmartSelect } from "@/components/General/SmartSelect";
import { downloadPostFile } from "@/utils/downloadFile";
import { ANALYSES_ENDPOINTS } from "@/redux/services/analyses/analysesEndpoints";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "@/components/ui/form";
import {
  useGetAnalysesQuery,
  useDeleteAnalysisMutation,
  useCreateAnalysisMutation,
} from "@/redux/services/analyses/analysesService";
import type { AnalysisResponse } from "@/redux/services/analyses/analysesService";
import { useGetEnumSelectOptionsQuery } from "@/redux/services/select_options/selectOptionsService";
import { useGetSamplesQuery } from "@/redux/services/samples/samplesService";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import Modal from "./AccountSequences/Modal";

const columnHelper = createColumnHelper<AnalysisResponse>();

const formatDate = (
  value: Date | string | undefined,
  lang: string,
) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString(lang, { timeZone: "UTC" });
};

type CreateFormData = {
  type: string;
  sample_id: string;
};

const AccountAnalysis = () => {
  const router = useRouter();
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.analyses;
  const analysisTypeDict = AccountDict.option.analysis_type;

  const [modal, setModal] = useState<{
    type: "add" | "delete" | null;
    analysis?: AnalysisResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingAnalyses } = useGetAnalysesQuery(
    lang,
    { pollingInterval: 15000 },
  );
  const [deleteAnalysis, { isLoading: deleting, error: deleteError }] =
    useDeleteAnalysisMutation();
  const [createAnalysis, { isLoading: creating, error: createError }] =
    useCreateAnalysisMutation();

  const { data: enumOptions, isLoading: loadingEnums } =
    useGetEnumSelectOptionsQuery();
  const { data: samples, isLoading: loadingSamples } = useGetSamplesQuery(lang);

  const createSchema = useMemo(
    () =>
      z.object({
        type: z.string().min(1, dict.validation.required),
        sample_id: z.string().min(1, dict.validation.required),
      }),
    [dict.validation.required],
  );

  const form = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { type: "", sample_id: "" },
  });

  const analysisTypeOptions = (enumOptions?.analysis_types ?? []).map((opt) => ({
    value: opt.value,
    label:
      (analysisTypeDict as Record<string, string>)[opt.value.toLowerCase()] ??
      opt.label,
  }));
  const sampleOptions = useMemo(
    () =>
      (samples ?? [])
        .map((s: SampleResponse) => ({
          value: s.id,
          label: s.origin_code,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" })),
    [samples],
  );

  const onSubmit: SubmitHandler<CreateFormData> = async (data) => {
    try {
      await createAnalysis(data).unwrap();
      form.reset();
      closeModal();
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteAnalysis(modal.analysis?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const hasRunning = data.some(
    (a) => a.status.toLowerCase() === "running",
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("sample", {
        header: dict.sample,
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
      columnHelper.accessor("type", {
        header: dict.type,
        size: 120,
        cell: (info) => {
          const v = info.getValue();
          const typeKey = v.toLowerCase();
          return (
            (analysisTypeDict as Record<string, string>)[typeKey] ?? v
          );
        },
      }),
      columnHelper.accessor("status", {
        header: dict.status,
        size: 120,
        cell: (info) => {
          const v = info.getValue();
          const statusKey = v.toLowerCase();
          const label =
            (dict.statusValues as Record<string, string>)[statusKey] ?? v;
          return (
            <Badge
              variant={
                statusKey as "pending" | "running" | "done" | "failed"
              }
            >
              {label}
            </Badge>
          );
        },
      }),
      ...(hasRunning
        ? [
            columnHelper.accessor("step", {
              header: dict.step,
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
        header: dict.startedAt,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.accessor("finished_at", {
        header: dict.finishedAt,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.accessor((row) => row.metrics?.coverage, {
        id: "coverage",
        header: dict.coverage,
        size: 100,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => {
          const v = info.getValue();
          return v === undefined || v === null ? "-" : v.toFixed(2);
        },
      }),
      columnHelper.accessor((row) => row.metrics?.primary_species, {
        id: "identifiedSpecies",
        header: dict.identifiedSpecies,
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
        header: dict.actions,
        size: 110,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <IconButton
              variant="primary"
              label={dict.view}
              icon={<Eye size={18} />}
              onClick={() =>
                router.push(`/account/analysis/${info.row.original.id}`)
              }
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() =>
                setModal({
                  type: "delete",
                  analysis: info.row.original,
                })
              }
            />
          </div>
        ),
      }),
    ],
    [dict, lang, router, analysisTypeDict, hasRunning],
  );

  const isBusy = deleting || creating || loadingEnums || loadingSamples;

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
        ANALYSES_ENDPOINTS.DOWNLOAD_BATCH_TSVS,
        { ids: selectedIds },
        "analyses.tsv",
      );
    } catch {}
    setDownloading(false);
  };

  return (
    <div className="w-full">
      <PageHeader
        icon={<Search size={24} />}
        title={dict.title}
        actionLabel={dict.newAnalysis}
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
          {dict.downloadTsv}
          {selectedIds.length > 0 && ` (${selectedIds.length})`}
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loadingAnalyses}
        emptyMessage={dict.noResults}
        countLabel={dict.showing}
        enableRowSelection={(row) =>
          row.original.status.toLowerCase() === "done" &&
          row.original.type.toLowerCase() !== "fastqc"
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        maxSelection={50}
      />

      {modal.type === "add" && (
        <Modal open onClose={closeModal} title={dict.createAnalysis}>
          {loadingEnums || loadingSamples ? (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label_class}>
                          {dict.type}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SmartSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={analysisTypeOptions}
                            placeholder={dict.selectType}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sample_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={label_class}>
                          {dict.sample}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SmartSelect
                            value={field.value}
                            onChange={field.onChange}
                            options={sampleOptions}
                            placeholder={dict.selectSample}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {createError && (
                  <div className="mt-4">
                    <Message
                      msg={
                        typeof createError === "string" &&
                        createError === "internalServer"
                          ? Errors[createError]
                          : String(createError)
                      }
                      type="error"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isBusy}
                    className="px-6 py-2 text-base"
                  >
                    {dict.cancel}
                  </Button>
                  {creating ? (
                    <Loading />
                  ) : (
                    <Button
                      type="submit"
                      variant="green"
                      className="px-6 py-2 text-base"
                    >
                      {dict.createAnalysis}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          )}
        </Modal>
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
          delete: dict.delete,
          cancel: dict.cancel,
          deleteConfirm: dict.deleteConfirm,
        }}
      />
    </div>
  );
};

export default AccountAnalysis;
