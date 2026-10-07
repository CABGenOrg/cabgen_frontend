"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { label_class } from "@/styles/tailwind_classes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import TextField from "@/components/General/TextField";
import SelectField from "@/components/General/SelectField";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useGetCitiesQuery } from "@/redux/services/cities/citiesService";
import {
  useGetFormSelectOptionsQuery,
} from "@/redux/services/select_options/selectOptionsService";
import {
  useCreateSampleMutation,
  useUpdateSampleMutation,
} from "@/redux/services/samples/samplesService";
import type {
  SampleResponse,
  SampleInput,
} from "@/redux/services/samples/samplesService";
import { getTranslateClient } from "@/lib/getTranslateClient";
import type { Locale } from "@/i18n/i18n.config";
import Modal from "@/components/General/Modal";
import { emptyToNull } from "@/utils/zodHelpers";
import { getChangedFields } from "@/utils/getChangedFields";
import { translateSentinel } from "@/utils/translateSentinel";

const dateStr = (d: Date | string | undefined) => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const getVal = (
  opts: { value: string; label: string }[],
  searchVal: string | null | undefined,
) => {
  if (!searchVal) return "";
  const matchByValue = opts.find((o) => o.value === searchVal);
  if (matchByValue) return matchByValue.value;
  const matchByLabel = opts.find((o) => o.label === searchVal);
  if (matchByLabel) return matchByLabel.value;
  return searchVal;
};

type SampleFormModalProps = {
  open: boolean;
  onClose: () => void;
  lang: string;
  dict: ReturnType<
    typeof getTranslateClient
  >["dictionary"]["Account"]["sequences"];
  errorsDict: Record<string, string>;
  initial?: SampleResponse | null;
};

const SampleFormModalBody: React.FC<
  SampleFormModalProps & {
    countries: { code: string; name: string }[];
    cities: { value: string; label: string }[];
    formOptions: {
      laboratories: { value: string; label: string }[];
      origins: { value: string; label: string }[];
      microorganisms: { value: string; label: string }[];
      sample_sources: { value: string; label: string }[];
      sequencers: { value: string; label: string }[];
      health_services: { value: string; label: string }[];
      genders: { value: string; label: string }[];
    };
  }
> = ({
  open,
  onClose,
  lang,
  dict,
  errorsDict,
  initial,
  countries,
  cities,
  formOptions,
}) => {
  const isEdit = !!initial;
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang as Locale);
  const seqOther = AccountDict.option.sequencer.other;
  const labOther = AccountDict.option.laboratory.other;
  const hsOther = AccountDict.option.healthService.other;

  const sampleSchema = z.object({
    collection_date: z.string().min(1, dict.validation.required),
    run_number: z.string().min(1, dict.validation.required),
    run_date: z.string().min(1, dict.validation.required),
    city: z.string().min(1, dict.validation.required),
    origin_code: z.string().min(1, dict.validation.required),
    in_network: z.string().min(1, dict.networkValidation),
    gender: emptyToNull.optional(),
    date_of_birth: emptyToNull.optional(),
    country_code: z.string().min(1, dict.validation.required),
    origin_id: z.string().min(1, dict.validation.required),
    sample_source_id: z.string().min(1, dict.validation.required),
    microorganism_id: z.string().min(1, dict.validation.required),
    sequencer_id: z.string().min(1, dict.validation.required),
    laboratory_id: z.string().min(1, dict.validation.required),
    health_service_id: z.string().min(1, dict.validation.required),
  });

  type SampleFormData = z.infer<typeof sampleSchema>;

  const genderOptions = formOptions.genders ?? [];

  const laboratoryOptions = [...(formOptions.laboratories ?? [])].sort(
    (a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );

  const cityOptions = [...(cities ?? [])].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );

  const healthServiceOptions = [...(formOptions.health_services ?? [])].sort(
    (a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
  );

  const countryOptions = (countries ?? [])
    .map((c) => ({
      value: c.code,
      label: c.name,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
    );

  const origins = useMemo(
    () =>
      [...(formOptions.origins ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    [formOptions.origins],
  );
  const microorganisms = useMemo(
    () =>
      [...(formOptions.microorganisms ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    [formOptions.microorganisms],
  );
  const sampleSources = useMemo(
    () =>
      [...(formOptions.sample_sources ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    [formOptions.sample_sources],
  );
  const sequencers = useMemo(
    () =>
      [...(formOptions.sequencers ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
      ),
    [formOptions.sequencers],
  );

  const sequencerOptions = [...sequencers];

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      collection_date: dateStr(initial.collection_date),
      run_number: initial.run_number ?? "",
      run_date: dateStr(initial.run_date),
      city: getVal(cityOptions, initial.city),
      origin_code: initial.origin_code ?? "",
      in_network: initial.in_network === true ? "yes" : "no",
      gender: getVal(genderOptions, initial.gender),
      date_of_birth: dateStr(initial.date_of_birth),
      country_code: getVal(countryOptions, initial.country_code),
      origin_id: getVal(origins, initial.origin),
      sample_source_id: getVal(sampleSources, initial.sample_source),
      microorganism_id: getVal(microorganisms, initial.microorganism),
      sequencer_id: getVal(
        sequencers,
        translateSentinel(initial.sequencer, "option.sequencer.other", seqOther),
      ),
      laboratory_id: getVal(
        laboratoryOptions,
        translateSentinel(initial.laboratory, "option.laboratory.other", labOther),
      ),
      health_service_id: getVal(
        healthServiceOptions,
        translateSentinel(
          initial.health_service,
          "option.healthService.other",
          hsOther,
        ),
      ),
    };
  }, [
    initial,
    cityOptions,
    genderOptions,
    countryOptions,
    origins,
    microorganisms,
    sampleSources,
    sequencers,
    laboratoryOptions,
    healthServiceOptions,
    seqOther,
    labOther,
    hsOther,
  ]);

  const form = useForm<SampleFormData>({
    resolver: zodResolver(sampleSchema),
    values: initialValues,
  });

  const [createSample, { isLoading: creating, error: createError }] =
    useCreateSampleMutation();
  const [updateSample, { isLoading: updating, error: updateError }] =
    useUpdateSampleMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<SampleFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        const changed = getChangedFields(
          initialValues ?? ({} as SampleFormData),
          data,
        );
        if (Object.keys(changed).length === 0) return;
        const payload = { ...changed } as Record<string, unknown>;
        if ("in_network" in payload) {
          payload.in_network = (payload.in_network as string) === "yes";
        }
        await updateSample({
          id: initial.id,
          data: payload as unknown as SampleInput,
        }).unwrap();
      } else {
        await createSample({
          ...(data as unknown as SampleInput),
          in_network: data.in_network === "yes",
        }).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editSample : dict.newSample}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField
              name="origin_code"
              label={dict.originCode}
              form={form}
              required
            />
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
              options={sequencerOptions}
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
              required
            />
            <FormField
              control={form.control}
              name="in_network"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 flex flex-col items-center text-center">
                  <FormLabel className={label_class}>
                    {dict.isPartOfNetwork}
                    <span className="text-red-500 ml-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      role="group"
                      className="inline-flex rounded-md border border-border overflow-hidden"
                    >
                      <button
                        type="button"
                        aria-pressed={field.value === "yes"}
                        onClick={() => field.onChange("yes")}
                        className={`px-5 py-2 text-base transition-colors ${
                          field.value === "yes"
                            ? "bg-cabgen-200 text-white"
                            : "bg-card text-foreground hover:bg-accent"
                        }`}
                      >
                        {dict.networkYes}
                      </button>
                      <button
                        type="button"
                        aria-pressed={field.value === "no"}
                        onClick={() => field.onChange("no")}
                        className={`px-5 py-2 text-base border-l border-border transition-colors ${
                          field.value === "no"
                            ? "bg-cabgen-200 text-white"
                            : "bg-card text-foreground hover:bg-accent"
                        }`}
                      >
                        {dict.networkNo}
                      </button>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">{dict.networkHint}</p>
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

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 text-base"
            >
              {dict.cancel}
            </Button>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                variant="green"
                className="px-6 py-2 text-base"
              >
                {dict.save}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const SampleFormModal: React.FC<SampleFormModalProps> = ({
  open,
  onClose,
  lang,
  dict,
  errorsDict,
  initial,
}) => {
  const { data: countries, error: countriesError } = useGetCountriesQuery(lang);
  const { data: cities, error: citiesError } = useGetCitiesQuery(lang);
  const { data: formOptions, error: formOptionsError } =
    useGetFormSelectOptionsQuery(lang);

  const optionsLoadFailed = !!(
    countriesError ||
    citiesError ||
    formOptionsError
  );

  if (optionsLoadFailed) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={initial ? dict.editSample : dict.newSample}
      >
        <Message msg={dict.optionsLoadError} type="error" />
      </Modal>
    );
  }

  if (!countries || !cities || !formOptions) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        title={initial ? dict.editSample : dict.newSample}
      >
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </Modal>
    );
  }

  return (
    <SampleFormModalBody
      open={open}
      onClose={onClose}
      lang={lang}
      dict={dict}
      errorsDict={errorsDict}
      initial={initial}
      countries={countries}
      cities={cities}
      formOptions={formOptions}
    />
  );
};

export default SampleFormModal;
