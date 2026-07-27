"use client";

import { useDispatch } from "react-redux";
import { baseUrl } from "@/utils/handleRequest";
import handleError from "@/utils/handleError";
import React, { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { SmartSelect } from "../General/SmartSelect";
import { X, Plus, Upload, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  section_btn,
  input_class,
  label_class,
} from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useGetCitiesQuery } from "@/redux/services/cities/citiesService";
import {
  useGetFormSelectOptionsQuery,
  useGetEnumSelectOptionsQuery,
} from "@/redux/services/select_options/selectOptionsService";
import {
  useGetSamplesQuery,
  useCreateSampleMutation,
  useUpdateSampleMutation,
  useDeleteSampleMutation,
} from "@/redux/services/samples/samplesService";
import type {
  SampleResponse,
  SampleInput,
} from "@/redux/services/samples/samplesService";
import { apiSlice } from "@/redux/api/apiSlice";
import { SAMPLES_ENDPOINTS } from "@/redux/services/samples/samplesEndpoints";

const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

const SampleFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  lang: string;
  dict: ReturnType<
    typeof getTranslateClient
  >["dictionary"]["Account"]["sequences"];
  genderDict: Record<string, string>;
  labOther: string;
  cityOther: string;
  healthServiceOther: string;
  errorsDict: Record<string, string>;
  initial?: SampleResponse | null;
}> = ({
  open,
  onClose,
  lang,
  dict,
  genderDict,
  labOther,
  cityOther,
  healthServiceOther,
  errorsDict,
  initial,
}) => {
  const isEdit = !!initial;

  const emptyToNull = z.string().transform((val) => (val === "" ? null : val));

  const sampleSchema = z.object({
    name: z.string().min(1, dict.validation.required),
    collection_date: z.string().min(1, dict.validation.required),
    run_number: z.string().min(1, dict.validation.required),
    run_date: z.string().min(1, dict.validation.required),
    city: emptyToNull,
    origin_code: emptyToNull,
    gender: emptyToNull,
    date_of_birth: emptyToNull,
    country_code: z.string().min(1, dict.validation.required),
    origin_id: z.string().min(1, dict.validation.required),
    sample_source_id: z.string().min(1, dict.validation.required),
    microorganism_id: z.string().min(1, dict.validation.required),
    sequencer_id: z.string().min(1, dict.validation.required),
    laboratory_id: z.string().min(1, dict.validation.required),
    health_service_id: z.string().min(1, dict.validation.required),
  });

  type SampleFormData = z.infer<typeof sampleSchema>;

  const dateStr = (d: Date | string | undefined) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().split("T")[0];
  };

  const form = useForm<SampleFormData>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      name: initial?.name ?? "",
      collection_date: dateStr(initial?.collection_date),
      run_number: initial?.run_number ?? "",
      run_date: dateStr(initial?.run_date),
      city: initial?.city ?? "",
      origin_code: initial?.origin_code ?? "",
      gender: initial?.gender ?? "",
      date_of_birth: dateStr(initial?.date_of_birth),
      country_code: initial?.country_code ?? "",
      origin_id: initial?.origin ?? "",
      sample_source_id: initial?.sample_source ?? "",
      microorganism_id: initial?.microorganism ?? "",
      sequencer_id: initial?.sequencer ?? "",
      laboratory_id: initial?.laboratory ?? "",
      health_service_id: initial?.health_service ?? "",
    },
  });

  const { data: countries, error: countriesError } = useGetCountriesQuery(lang);
  const { data: cities, error: citiesError } = useGetCitiesQuery();
  const { data: formOptions, error: formOptionsError } =
    useGetFormSelectOptionsQuery(lang);
  const { data: enumOptions, error: enumOptionsError } =
    useGetEnumSelectOptionsQuery();

  const optionsLoadFailed = !!(
    countriesError ||
    citiesError ||
    formOptionsError ||
    enumOptionsError
  );
  const [createSample, { isLoading: creating, error: createError }] =
    useCreateSampleMutation();
  const [updateSample, { isLoading: updating, error: updateError }] =
    useUpdateSampleMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<SampleFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        await updateSample({
          id: initial.id,
          data: data as unknown as SampleInput,
        }).unwrap();
      } else {
        await createSample(data as unknown as SampleInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  const genderOptions = (enumOptions?.genders ?? []).map((g) => ({
    ...g,
    label: genderDict[g.value.toLowerCase()] ?? g.label,
  }));

  const laboratoryOptions = (formOptions?.laboratories ?? []).map((o) => ({
    ...o,
    label: o.label === "option.laboratory.other" ? labOther : o.label,
  }));

  const cityOptions = (cities ?? []).map((o) => ({
    ...o,
    label: o.label === "option.city.other" ? cityOther : o.label,
  }));

  const healthServiceOptions = (formOptions?.health_services ?? []).map(
    (o) => ({
      ...o,
      label:
        o.label === "option.healthService.other" ? healthServiceOther : o.label,
    }),
  );

  const origins = formOptions?.origins ?? [];
  const microorganisms = formOptions?.microorganisms ?? [];
  const sampleSources = formOptions?.sample_sources ?? [];
  const sequencers = formOptions?.sequencers ?? [];

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.code,
    label: c.name,
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editSample : dict.newSample}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {optionsLoadFailed && (
            <div className="mb-4">
              <Message msg={dict.optionsLoadError} type="error" />
            </div>
          )}
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField name="name" label={dict.name} form={form} required />
            <SelectField
              name="country_code"
              label={dict.country}
              form={form}
              options={countryOptions}
              placeholder={dict.selectPlaceholder}
              required
            />
            <TextField
              name="collection_date"
              label={dict.collectionDate}
              form={form}
              type="date"
              required
            />
            <TextField
              name="run_number"
              label={dict.runNumber}
              form={form}
              required
            />
            <TextField
              name="run_date"
              label={dict.runDate}
              form={form}
              type="date"
              required
            />
            <TextField name="origin_code" label={dict.originCode} form={form} />
            <SelectField
              name="gender"
              label={dict.gender}
              form={form}
              options={genderOptions}
              placeholder={dict.selectPlaceholder}
            />
            <TextField
              name="date_of_birth"
              label={dict.dateOfBirth}
              form={form}
              type="date"
            />
            <SelectField
              name="origin_id"
              label={dict.origin}
              form={form}
              options={origins}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="sample_source_id"
              label={dict.sampleSource}
              form={form}
              options={sampleSources}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="microorganism_id"
              label={dict.microorganism}
              form={form}
              options={microorganisms}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="sequencer_id"
              label={dict.sequencer}
              form={form}
              options={sequencers}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="laboratory_id"
              label={dict.laboratory}
              form={form}
              options={laboratoryOptions}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="health_service_id"
              label={dict.healthService}
              form={form}
              options={healthServiceOptions}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="city"
              label={dict.city}
              form={form}
              options={cityOptions}
              placeholder={dict.selectPlaceholder}
            />
          </div>

          {error && (
            <div className="mt-4">
              <Message
                msg={
                  typeof error === "string" && error === "internalServer"
                    ? errorsDict[error]
                    : String(error)
                }
                type="error"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {dict.cancel}
            </Button>
            {isLoading ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className={section_btn}
                disabled={optionsLoadFailed}
              >
                {dict.save}
              </button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const ensureGzipped = async (file: File): Promise<File> => {
  if (file.name.endsWith(".gz")) return file;
  const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
  const blob = await new Response(stream).blob();
  return new File([blob], `${file.name}.gz`, { type: "application/gzip" });
};

const uploadWithProgress = (
  url: string,
  lang: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept-Language", lang);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = xhr.responseText;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject({ status: xhr.status, data });
      }
    };

    xhr.onerror = () => reject({ status: "FETCH_ERROR", data: null });

    xhr.send(formData);
  });
};

const UploadFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  lang: string;
  dict: ReturnType<
    typeof getTranslateClient
  >["dictionary"]["Account"]["sequences"];
  errorsDict: Record<string, string>;
  sample: SampleResponse | null;
}> = ({ open, onClose, lang, dict, errorsDict, sample }) => {
  const dispatch = useDispatch();

  const [files, setFiles] = useState<{
    fastq1: File | null;
    fastq2: File | null;
    fasta: File | null;
  }>({
    fastq1: null,
    fastq2: null,
    fasta: null,
  });

  const [phase, setPhase] = useState<"idle" | "compressing" | "uploading">(
    "idle",
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = (files.fastq1 && files.fastq2) || files.fasta;
  const isBusy = phase !== "idle";

  const onSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!sample || !canSubmit || isBusy) return;
    setError(null);

    try {
      const formData = new FormData();

      if (files.fastq1 && files.fastq2) {
        setPhase("compressing");
        const [fq1, fq2] = await Promise.all([
          ensureGzipped(files.fastq1),
          ensureGzipped(files.fastq2),
        ]);
        formData.append("fastq1", fq1);
        formData.append("fastq2", fq2);
      }

      if (files.fasta) {
        setPhase("compressing");
        const fa = await ensureGzipped(files.fasta);
        formData.append("fasta", fa);
      }

      setPhase("uploading");
      setProgress(0);
      await uploadWithProgress(
        `${baseUrl}${SAMPLES_ENDPOINTS.DEFAULT}/${sample.id}/upload`,
        lang,
        formData,
        setProgress,
      );

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Samples", id: sample.id },
          "Samples",
        ]),
      );
      setFiles({ fastq1: null, fastq2: null, fasta: null });
      onClose();
    } catch (err) {
      setError(handleError(err as any));
    } finally {
      setPhase("idle");
    }
  };

  const fileInput = (key: keyof typeof files, label: string) => (
    <div className="flex flex-col gap-2">
      <span className={label_class}>{label}</span>
      <label
        className={`
          flex items-center justify-between gap-3 px-4 py-3 rounded-md border-2 border-dashed cursor-pointer
          transition-colors
          ${isBusy ? "opacity-50 pointer-events-none" : ""}
          ${
            files[key]
              ? "border-cabgen-200 bg-cabgen-200/5"
              : "border-gray-300 hover:border-cabgen-300 bg-gray-50"
          }
        `}
      >
        <span
          className={`text-sm truncate ${files[key] ? "text-gray-900 font-medium" : "text-gray-400"}`}
        >
          {files[key]?.name ??
            (key === "fasta" ? ".fasta" : ".fastq|.fastq.gz")}
        </span>
        <span className="text-xs shrink-0 px-2 py-1 rounded bg-white border border-gray-200 text-gray-500">
          {files[key]
            ? `${(files[key]!.size / 1024).toFixed(0)} KB`
            : dict.selectPlaceholder}
        </span>
        <input
          type="file"
          disabled={isBusy}
          onChange={(e) =>
            setFiles((p) => ({ ...p, [key]: e.target.files?.[0] ?? null }))
          }
          className="hidden"
        />
      </label>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${dict.uploadSequences} - ${sample?.name ?? ""}`}
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-5">
          {fileInput("fastq1", dict.fastq1)}
          {fileInput("fastq2", dict.fastq2)}
          {fileInput("fasta", dict.fasta)}
        </div>

        {phase === "compressing" && (
          <p className="mt-4 text-sm text-gray-500">{dict.compressing}</p>
        )}

        {phase === "uploading" && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{dict.uploading}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-cabgen-200 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <Message
              msg={error === "internalServer" ? errorsDict[error] : error}
              type="error"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isBusy}
          >
            {dict.cancel}
          </Button>
          <button
            type="submit"
            className={`${section_btn} flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed`}
            disabled={!canSubmit || isBusy}
          >
            {isBusy && <Loader2 size={16} className="animate-spin" />}
            {dict.upload}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const TextField: React.FC<{
  name: string;
  label: string;
  form: any;
  type?: string;
  required?: boolean;
}> = ({ name, label, form, type = "text", required }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label_class}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </FormLabel>
        <FormControl>
          <input type={type} className={input_class} {...field} />
        </FormControl>
        <FormMessage className="text-red-600" />
      </FormItem>
    )}
  />
);

const SelectField: React.FC<{
  name: string;
  label: string;
  form: any;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}> = ({ name, label, form, options, placeholder, required }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label_class}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </FormLabel>
        <FormControl>
          <SmartSelect
            value={field.value}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
          />
        </FormControl>
        <FormMessage className="text-red-600" />
      </FormItem>
    )}
  />
);

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | null;
    sample?: SampleResponse;
  }>({ type: null });

  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingSamples } = useGetSamplesQuery();
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
      columnHelper.accessor("name", { header: dict.name, size: 140 }),
      columnHelper.accessor("microorganism", {
        header: dict.microorganism,
        size: 180,
      }),
      columnHelper.accessor("origin", { header: dict.origin, size: 110 }),
      columnHelper.accessor("sample_source", {
        header: dict.sampleSource,
        size: 130,
      }),
      columnHelper.accessor("sequencer", { header: dict.sequencer, size: 150 }),
      columnHelper.accessor("collection_date", {
        header: dict.collectionDate,
        size: 130,
        cell: (info) => {
          const v = info.getValue();
          if (!v) return "-";
          const d = v instanceof Date ? v : new Date(v);
          return isNaN(d.getTime())
            ? "-"
            : d.toLocaleDateString(lang, { timeZone: "UTC" });
        },
      }),
      columnHelper.accessor("country_code", { header: dict.country, size: 80 }),
      columnHelper.accessor("city", { header: dict.city, size: 130 }),
      columnHelper.accessor("fastq1", {
        header: dict.fastq1,
        size: 100,
        cell: (info) => {
          const v = info.getValue() || "";
          return (
            <span title={v} className="truncate block max-w-[100px]">
              {v.split("/").pop() || "-"}
            </span>
          );
        },
      }),
      columnHelper.accessor("fastq2", {
        header: dict.fastq2,
        size: 100,
        cell: (info) => {
          const v = info.getValue() || "";
          return (
            <span title={v} className="truncate block max-w-[100px]">
              {v.split("/").pop() || "-"}
            </span>
          );
        },
      }),
      columnHelper.accessor("fasta", {
        header: dict.fasta,
        size: 100,
        cell: (info) => {
          const v = info.getValue() || "";
          return (
            <span title={v} className="truncate block max-w-[100px]">
              {v.split("/").pop() || "-"}
            </span>
          );
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

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-semibold">{dict.title}</h1>
        <button
          className={`${section_btn} flex items-center gap-1.5 shrink-0`}
          onClick={() => setModal({ type: "add" })}
        >
          <Plus size={20} /> {dict.newSample}
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
                        className="px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors"
                        onClick={h.column.getToggleSortingHandler()}
                        style={{ width: h.getSize() }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
                          )}
                          {sorted && (
                            <span
                              className={
                                sorted === "asc"
                                  ? "text-cabgen-200"
                                  : "text-cabgen-200"
                              }
                            >
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
              {loadingSamples ? (
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
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
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
              {dict.deleteConfirm.replace("{name}", modal.sample?.name ?? "")}
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
          <Button variant="outline" onClick={closeModal}>
            {dict.cancel}
          </Button>
          {deleting ? (
            <Loading />
          ) : (
            <Button variant="destructive" onClick={() => handleDelete()}>
              {dict.delete}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountSequences;
