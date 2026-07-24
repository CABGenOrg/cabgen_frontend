"use client";

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
import { X, Plus, Upload, Pencil, Trash2 } from "lucide-react";
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
  useUploadMutation,
  useDeleteSampleMutation,
} from "@/redux/services/samples/samplesService";
import type {
  SampleResponse,
  SampleInput,
  SampleAttachmentInput,
} from "@/redux/services/samples/samplesService";

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
  errorsDict: Record<string, string>;
  initial?: SampleResponse | null;
}> = ({ open, onClose, lang, dict, genderDict, labOther, cityOther, errorsDict, initial }) => {
  const isEdit = !!initial;

  const sampleSchema = z.object({
    name: z.string().min(1, dict.validation.required),
    collection_date: z.string().min(1, dict.validation.required),
    run_number: z.string().min(1, dict.validation.required),
    run_date: z.string().min(1, dict.validation.required),
    city: z.string().min(1, dict.validation.required),
    origin_code: z.string().min(1, dict.validation.required),
    gender: z.string().min(1, dict.validation.required),
    date_of_birth: z.string().min(1, dict.validation.required),
    country_code: z.string().min(1, dict.validation.required),
    origin: z.string().min(1, dict.validation.required),
    sample_source: z.string().min(1, dict.validation.required),
    microorganism: z.string().min(1, dict.validation.required),
    sequencer: z.string().min(1, dict.validation.required),
    laboratory: z.string().min(1, dict.validation.required),
    health_service: z.string().min(1, dict.validation.required),
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
      origin: initial?.origin ?? "",
      sample_source: initial?.sample_source ?? "",
      microorganism: initial?.microorganism ?? "",
      sequencer: initial?.sequencer ?? "",
      laboratory: initial?.laboratory ?? "",
      health_service: initial?.health_service ?? "",
    },
  });

  const { data: countries } = useGetCountriesQuery(lang);
  const { data: cities } = useGetCitiesQuery();
  const { data: formOptions } = useGetFormSelectOptionsQuery(lang);
  const { data: enumOptions } = useGetEnumSelectOptionsQuery();
  const [createSample, { isLoading: creating, error: createError }] =
    useCreateSampleMutation();
  const [updateSample, { isLoading: updating, error: updateError }] =
    useUpdateSampleMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<SampleFormData> = async (data) => {
    const payload = { ...data };
    if (isEdit && initial) {
      await updateSample({
        id: initial.id,
        data: payload as unknown as SampleInput,
      });
    } else {
      await createSample(payload as unknown as SampleInput);
    }
    form.reset();
    onClose();
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

  const origins = formOptions?.origins ?? [];
  const microorganisms = formOptions?.microorganisms ?? [];
  const sampleSources = formOptions?.sample_sources ?? [];
  const sequencers = formOptions?.sequencers ?? [];
  const healthServices = formOptions?.health_service ?? [];

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
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField name="name" label={dict.name} form={form} />
            <SelectField
              name="country_code"
              label={dict.country}
              form={form}
              options={countryOptions}
              placeholder={dict.selectPlaceholder}
            />
            <TextField
              name="collection_date"
              label={dict.collectionDate}
              form={form}
              type="date"
            />
            <TextField name="run_number" label={dict.runNumber} form={form} />
            <TextField
              name="run_date"
              label={dict.runDate}
              form={form}
              type="date"
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
              name="origin"
              label={dict.origin}
              form={form}
              options={origins}
              placeholder={dict.selectPlaceholder}
            />
            <SelectField
              name="sample_source"
              label={dict.sampleSource}
              form={form}
              options={sampleSources}
              placeholder={dict.selectPlaceholder}
            />
            <SelectField
              name="microorganism"
              label={dict.microorganism}
              form={form}
              options={microorganisms}
              placeholder={dict.selectPlaceholder}
            />
            <SelectField
              name="sequencer"
              label={dict.sequencer}
              form={form}
              options={sequencers}
              placeholder={dict.selectPlaceholder}
            />
            <SelectField
              name="laboratory"
              label={dict.laboratory}
              form={form}
              options={laboratoryOptions}
              placeholder={dict.selectPlaceholder}
            />
            <SelectField
              name="health_service"
              label={dict.healthService}
              form={form}
              options={healthServices}
              placeholder={dict.selectPlaceholder}
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
              <button type="submit" className={section_btn}>
                {dict.save}
              </button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const UploadFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  dict: ReturnType<
    typeof getTranslateClient
  >["dictionary"]["Account"]["sequences"];
  errorsDict: Record<string, string>;
  sample: SampleResponse | null;
}> = ({ open, onClose, dict, errorsDict, sample }) => {
  const uploadSchema = z.object({
    fastq1: z.string().min(1, dict.validation.required),
    fastq2: z.string().min(1, dict.validation.required),
    fasta: z.string().min(1, dict.validation.required),
  });

  type UploadFormData = z.infer<typeof uploadSchema>;
  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { fastq1: "", fastq2: "", fasta: "" },
  });

  const [upload, { isLoading, error }] = useUploadMutation();

  const onSubmit: SubmitHandler<UploadFormData> = async (data) => {
    if (!sample) return;
    await upload({ id: sample.id, data } as {
      id: string;
      data: SampleAttachmentInput;
    });
    form.reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${dict.uploadSequences} — ${sample?.name ?? ""}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <TextField name="fastq1" label={dict.fastq1} form={form} />
            <TextField name="fastq2" label={dict.fastq2} form={form} />
            <TextField name="fasta" label={dict.fasta} form={form} />
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
              <button type="submit" className={section_btn}>
                {dict.upload}
              </button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const TextField: React.FC<{
  name: string;
  label: string;
  form: any;
  type?: string;
}> = ({ name, label, form, type = "text" }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label_class}>{label}</FormLabel>
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
}> = ({ name, label, form, options, placeholder }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label_class}>{label}</FormLabel>
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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | null;
    sample?: SampleResponse;
  }>({ type: null });

  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingSamples } = useGetSamplesQuery();
  const [deleteSample, { isLoading: deleting }] = useDeleteSampleMutation();

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
        cell: (info) => info.getValue().toLocaleDateString(lang),
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
          errorsDict={Errors}
          initial={modal.sample}
        />
      )}

      {modal.type === "upload" && (
        <UploadFormModal
          open
          onClose={closeModal}
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
          <Button variant="outline" onClick={closeModal}>
            {dict.cancel}
          </Button>
          {deleting ? (
            <Loading />
          ) : (
            <Button
              variant="destructive"
              onClick={() => {
                deleteSample(modal.sample?.id ?? "");
                closeModal();
              }}
            >
              {dict.delete}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountSequences;
