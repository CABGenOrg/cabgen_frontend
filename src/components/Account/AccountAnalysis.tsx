"use client";

import { useState, useMemo } from "react";
import { Plus, Eye, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    responsive?: string;
  }
}

import { section_btn, label_class } from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { SmartSelect } from "@/components/General/SmartSelect";
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<{
    type: "add" | "delete" | null;
    analysis?: AnalysisResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingAnalyses } = useGetAnalysesQuery();
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
      (samples ?? []).map((s: SampleResponse) => ({
        value: s.id,
        label: s.name,
      })),
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
          return v === undefined || v === null ? "-" : String(v);
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
            <button
              aria-label={dict.view}
              className="p-2 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                router.push(`/account/analysis/${info.row.original.id}`)
              }
            >
              <Eye size={15} />
            </button>
            <button
              aria-label={dict.delete}
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
    [dict, lang, router, analysisTypeDict],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const isBusy = deleting || creating || loadingEnums || loadingSamples;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Search className="text-cabgen-400" size={24} />
          <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
            {dict.title}
          </span>
        </h1>
        <button
          className={`${section_btn} flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto`}
          onClick={() => setModal({ type: "add" })}
        >
          <Plus size={20} /> {dict.newAnalysis}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-gray-50">
                  {hg.headers.map((h) => {
                    const sorted = h.column.getIsSorted();
                    return (
                      <th
                        key={h.id}
                        className={`px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors ${h.column.columnDef.meta?.responsive ?? ""}`}
                        onClick={h.column.getToggleSortingHandler()}
                        style={{ width: h.getSize() }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
                          )}
                          {sorted && (
                            <span className="text-cabgen-200">
                              {sorted === "asc" ? "\u2191" : "\u2193"}
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loadingAnalyses ? (
                <tr>
                  <td colSpan={99} className="py-12 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={99} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <span className="text-sm">{dict.noResults}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 odd:bg-gray-50/30 hover:bg-gray-100/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 cursor-default ${cell.column.columnDef.meta?.responsive ?? ""}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
            {dict.showing.replace("{count}", String(data.length))}
          </div>
        )}
      </div>

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

      <Modal
        open={modal.type === "delete"}
        onClose={closeModal}
        title={dict.delete}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-gray-900 font-medium mb-1">{dict.delete}</p>
            <p className="text-gray-500 text-sm">
              {dict.deleteConfirm.replace(
                "{name}",
                modal.analysis?.sample ?? "",
              )}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {deleteError && (
            <Message
              msg={
                typeof deleteError === "string" &&
                deleteError === "internalServer"
                  ? Errors[deleteError]
                  : String(deleteError)
              }
              type="error"
            />
          )}
          <Button variant="outline" onClick={closeModal} className="px-6 py-2 text-base">
            {dict.cancel}
          </Button>
          {deleting ? (
            <Loading />
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              {dict.delete}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountAnalysis;
