"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "@/components/ui/form";
import Modal from "@/components/General/Modal";
import TextField from "@/components/General/TextField";
import SelectField from "@/components/General/SelectField";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { SmartSelect } from "@/components/General/SmartSelect";
import { label_class } from "@/styles/tailwind_classes";
import { useGetEnumSelectOptionsQuery } from "@/redux/services/select_options/selectOptionsService";
import { useGetAdminSamplesQuery } from "@/redux/services/admin/adminSamplesService";
import { useGetUsersQuery } from "@/redux/services/admin/adminUsersService";
import {
  useCreateAdminAnalysisMutation,
  useUpdateAdminAnalysisMutation,
} from "@/redux/services/admin/adminAnalysesService";
import type {
  AdminAnalysisResponse,
  AdminAnalysisInput,
  AdminAnalysisUpdateData,
} from "@/redux/services/admin/adminAnalysesService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { emptyToNull } from "@/utils/zodHelpers";
import { getChangedFields } from "@/utils/getChangedFields";

type AdminAnalysisModalProps = {
  open: boolean;
  onClose: () => void;
  errorsDict: Record<string, string>;
  initial?: AdminAnalysisResponse | null;
};

type CreateFormData = {
  type: string;
  sample_id: string;
  user_id: string;
};

type EditFormData = {
  status: string;
  error_message?: string | null;
  metrics: {
    coverage?: string | null;
    completeness?: string | null;
    contamination?: string | null;
    genome_size?: string | null;
    n50?: string | null;
    primary_species?: string | null;
    secondary_species?: string | null;
    mlst?: string | null;
    poli_mutations?: string | null;
    other_mutations?: string | null;
    acquired_resistance?: string | null;
    vfdb?: string | null;
    plasmid?: string | null;
  };
  fastqc1?: string | null;
  fastqc2?: string | null;
  results_zip_path?: string | null;
};

const LIST_KEYS = [
  "poli_mutations",
  "other_mutations",
  "acquired_resistance",
  "vfdb",
  "plasmid",
] as const;

const STRING_KEYS = [
  "completeness",
  "contamination",
  "genome_size",
  "n50",
  "primary_species",
  "secondary_species",
  "mlst",
] as const;

const listToStr = (value: string[] | undefined): string =>
  (value ?? []).join(", ");

const strToList = (
  value: string | null | undefined,
): string[] | undefined => {
  if (!value) return undefined;
  const list = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
};

const AdminAnalysisModalBody: React.FC<
  AdminAnalysisModalProps & {
    typeOptions: { value: string; label: string }[];
    sampleOptions: { value: string; label: string }[];
    userOptions: { value: string; label: string }[];
    statusOptions: { value: string; label: string }[];
  }
> = ({
  open,
  onClose,
  errorsDict,
  initial,
  typeOptions,
  sampleOptions,
  userOptions,
  statusOptions,
}) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const analysisDict = AccountDict.analyses;
  const isEdit = !!initial;

  const createSchema = z.object({
    type: z.string().min(1, analysisDict.validation.required),
    sample_id: z.string().min(1, analysisDict.validation.required),
    user_id: z.string().min(1, analysisDict.validation.required),
  });

  const editSchema = z.object({
    status: z.string().min(1, analysisDict.validation.required),
    error_message: emptyToNull.optional(),
    metrics: z
      .object({
        coverage: emptyToNull.optional(),
        completeness: emptyToNull.optional(),
        contamination: emptyToNull.optional(),
        genome_size: emptyToNull.optional(),
        n50: emptyToNull.optional(),
        primary_species: emptyToNull.optional(),
        secondary_species: emptyToNull.optional(),
        mlst: emptyToNull.optional(),
        poli_mutations: emptyToNull.optional(),
        other_mutations: emptyToNull.optional(),
        acquired_resistance: emptyToNull.optional(),
        vfdb: emptyToNull.optional(),
        plasmid: emptyToNull.optional(),
      })
      .partial().optional(),
    fastqc1: emptyToNull.optional(),
    fastqc2: emptyToNull.optional(),
    results_zip_path: emptyToNull.optional(),
  });

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { type: "", sample_id: "", user_id: "" },
  });

  const editInitialValues = useMemo(() => {
    if (!initial) return undefined;
    const m = initial.metrics ?? {};
    return {
      status: initial.status?.toLowerCase() ?? "",
      error_message: initial.error_message ?? "",
      metrics: {
        coverage: m.coverage?.toString() ?? "",
        completeness: m.completeness ?? "",
        contamination: m.contamination ?? "",
        genome_size: m.genome_size ?? "",
        n50: m.n50 ?? "",
        primary_species: m.primary_species ?? "",
        secondary_species: m.secondary_species ?? "",
        mlst: m.mlst ?? "",
        poli_mutations: listToStr(m.poli_mutations),
        other_mutations: listToStr(m.other_mutations),
        acquired_resistance: listToStr(m.acquired_resistance),
        vfdb: listToStr(m.vfdb),
        plasmid: listToStr(m.plasmid),
      },
      fastqc1: initial.fastqc1 ?? "",
      fastqc2: initial.fastqc2 ?? "",
      results_zip_path: initial.results_zip_path ?? "",
    };
  }, [initial]);

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    values: editInitialValues,
  });

  const filteredStatusOptions = useMemo(() => {
    if (!initial) return statusOptions;
    const current = initial.status?.toLowerCase() ?? "";
    if (current === "done" || current === "failed") {
      return statusOptions.filter((o) => o.value === "pending" || o.value === "failed");
    }
    return statusOptions.filter((o) => o.value === "failed");
  }, [initial, statusOptions]);

  const [createAnalysis, { isLoading: creating, error: createError }] =
    useCreateAdminAnalysisMutation();
  const [updateAnalysis, { isLoading: updating, error: updateError }] =
    useUpdateAdminAnalysisMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onCreate: SubmitHandler<CreateFormData> = async (data) => {
    try {
      await createAnalysis(data as AdminAnalysisInput).unwrap();
      createForm.reset();
      onClose();
    } catch {}
  };

  const onUpdate: SubmitHandler<EditFormData> = async (data) => {
    if (!initial) return;
    try {
      const changed = getChangedFields(
        editInitialValues ?? ({} as EditFormData),
        data,
      );
      if (Object.keys(changed).length === 0) return;
      if (changed.status) {
        changed.status = changed.status.toUpperCase();
      }
      const metrics = changed.metrics as EditFormData["metrics"] | undefined;
      if (metrics) {
        const fullMetrics: Record<string, unknown> = {};
        fullMetrics.coverage = metrics.coverage
          ? Number(metrics.coverage)
          : null;
        for (const key of STRING_KEYS) {
          fullMetrics[key] = metrics[key as keyof typeof metrics] ?? null;
        }
        for (const key of LIST_KEYS) {
          fullMetrics[key] =
            strToList(metrics[key as keyof typeof metrics] as string) ?? null;
        }
        changed.metrics = Object.values(fullMetrics).some((v) => v !== null)
          ? (fullMetrics as unknown as EditFormData["metrics"])
          : (null as never);
      }
      await updateAnalysis({
        id: initial.id,
        data: changed as Partial<AdminAnalysisUpdateData>,
      }).unwrap();
      editForm.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? adminDict.editAnalysis : adminDict.createAnalysis}
    >
      {isEdit ? (
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(onUpdate)}>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <SelectField
                name="status"
                label={analysisDict.status}
                form={editForm}
                options={filteredStatusOptions}
                placeholder={adminDict.selectPlaceholder}
                required
              />
              <TextField
                name="error_message"
                label={adminDict.message}
                form={editForm}
              />
              <p className="sm:col-span-2 text-sm font-semibold text-cabgen-600 uppercase tracking-wide border-b border-gray-100 pb-1 mt-2">
                {adminDict.metrics}
              </p>
              <TextField
                name="metrics.coverage"
                label={analysisDict.detail.metrics.coverage}
                form={editForm}
                type="number"
              />
              <TextField
                name="metrics.completeness"
                label={analysisDict.detail.metrics.completeness}
                form={editForm}
              />
              <TextField
                name="metrics.contamination"
                label={analysisDict.detail.metrics.contamination}
                form={editForm}
              />
              <TextField
                name="metrics.genome_size"
                label={analysisDict.detail.metrics.genomeSize}
                form={editForm}
              />
              <TextField
                name="metrics.n50"
                label={analysisDict.detail.metrics.n50}
                form={editForm}
              />
              <TextField
                name="metrics.primary_species"
                label={analysisDict.detail.metrics.identifiedSpecies}
                form={editForm}
              />
              <TextField
                name="metrics.secondary_species"
                label={analysisDict.detail.metrics.secondarySpecies}
                form={editForm}
              />
              <TextField
                name="metrics.mlst"
                label={analysisDict.detail.metrics.mlst}
                form={editForm}
              />
              <TextField
                name="metrics.poli_mutations"
                label={analysisDict.detail.metrics.poliMutations}
                form={editForm}
              />
              <TextField
                name="metrics.other_mutations"
                label={analysisDict.detail.metrics.otherMutations}
                form={editForm}
              />
              <TextField
                name="metrics.acquired_resistance"
                label={analysisDict.detail.metrics.acquiredResistance}
                form={editForm}
              />
              <TextField
                name="metrics.vfdb"
                label={analysisDict.detail.metrics.vfdb}
                form={editForm}
              />
              <TextField
                name="metrics.plasmid"
                label={analysisDict.detail.metrics.plasmid}
                form={editForm}
              />
              <TextField
                name="fastqc1"
                label={analysisDict.detail.fastqc1}
                form={editForm}
              />
              <TextField
                name="fastqc2"
                label={analysisDict.detail.fastqc2}
                form={editForm}
              />
              <TextField
                name="results_zip_path"
                label={adminDict.resultsZipPath}
                form={editForm}
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

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 text-base"
              >
                {adminDict.cancel}
              </Button>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  variant="green"
                  className="px-6 py-2 text-base"
                >
                  {adminDict.save}
                </Button>
              )}
            </div>
          </form>
        </Form>
      ) : (
        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(onCreate)}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={createForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {analysisDict.type}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SmartSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={typeOptions}
                        placeholder={analysisDict.selectType}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="sample_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {analysisDict.sample}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SmartSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={sampleOptions}
                        placeholder={analysisDict.selectSample}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {adminDict.user}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SmartSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={userOptions}
                        placeholder={adminDict.selectPlaceholder}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
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

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 text-base"
              >
                {adminDict.cancel}
              </Button>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  variant="green"
                  className="px-6 py-2 text-base"
                >
                  {adminDict.createAnalysis}
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
};

const AdminAnalysisModal: React.FC<AdminAnalysisModalProps> = ({
  open,
  onClose,
  errorsDict,
  initial,
}) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const analysisDict = AccountDict.analyses;
  const analysisTypeDict = AccountDict.option.analysis_type;
  const adminDict = AccountDict.admin;
  const isEdit = !!initial;

  const { data: enumOptions, error: enumError } =
    useGetEnumSelectOptionsQuery();
  const { data: samples, error: samplesError } = useGetAdminSamplesQuery(lang);
  const { data: users, error: usersError } = useGetUsersQuery("");

  const loadFailed = !!(enumError || samplesError || usersError);

  const typeOptions = (enumOptions?.analysis_types ?? []).map((opt) => ({
    value: opt.value,
    label:
      (analysisTypeDict as Record<string, string>)[opt.value.toLowerCase()] ??
      opt.label,
  }));
  const sampleOptions = (samples ?? []).map((s) => ({
    value: s.id,
    label: s.origin_code,
  })).sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
  const userOptions = (users ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  })).sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
  const statusOptions = Object.entries(analysisDict.statusValues).map(
    ([value, label]) => ({ value, label }),
  );

  const title = isEdit ? adminDict.editAnalysis : adminDict.createAnalysis;

  if (loadFailed) {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <Message msg={"Failed to load options"} type="error" />
      </Modal>
    );
  }

  if (!enumOptions || !samples || !users) {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </Modal>
    );
  }

  return (
    <AdminAnalysisModalBody
      open={open}
      onClose={onClose}
      errorsDict={errorsDict}
      initial={initial}
      typeOptions={typeOptions}
      sampleOptions={sampleOptions}
      userOptions={userOptions}
      statusOptions={statusOptions}
    />
  );
};

export default AdminAnalysisModal;
