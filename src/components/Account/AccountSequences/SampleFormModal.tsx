"use client";

import React from "react";
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
import { SmartSelect } from "../../General/SmartSelect";
import { input_class, label_class } from "@/styles/tailwind_classes";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useGetCitiesQuery } from "@/redux/services/cities/citiesService";
import {
  useGetFormSelectOptionsQuery,
  useGetEnumSelectOptionsQuery,
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
import Modal from "./Modal";
import { emptyToNull } from "@/utils/zodHelpers";

const dateStr = (d: Date | string | undefined) => {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
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
  genderDict: Record<string, string>;
  labOther: string;
  cityOther: string;
  healthServiceOther: string;
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
    };
    enumOptions: { genders: { value: string; label: string }[] };
  }
> = ({
  open,
  onClose,
  dict,
  genderDict,
  labOther,
  cityOther,
  healthServiceOther,
  errorsDict,
  initial,
  countries,
  cities,
  formOptions,
  enumOptions,
}) => {
  const isEdit = !!initial;

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

  const genderOptions = (enumOptions.genders ?? []).map((g) => ({
    ...g,
    label: genderDict[g.value.toLowerCase()] ?? g.label,
  }));

  const laboratoryOptions = (formOptions.laboratories ?? []).map((o) => ({
    ...o,
    label: o.label === "option.laboratory.other" ? labOther : o.label,
  }));

  const cityOptions = (cities ?? []).map((o) => ({
    ...o,
    label: o.label === "option.city.other" ? cityOther : o.label,
  }));

  const healthServiceOptions = (formOptions.health_services ?? []).map((o) => ({
    ...o,
    label:
      o.label === "option.healthService.other" ? healthServiceOther : o.label,
  }));

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const origins = formOptions.origins ?? [];
  const microorganisms = formOptions.microorganisms ?? [];
  const sampleSources = formOptions.sample_sources ?? [];
  const sequencers = formOptions.sequencers ?? [];

  const form = useForm<SampleFormData>({
    resolver: zodResolver(sampleSchema),
    defaultValues: {
      name: initial?.name ?? "",
      collection_date: dateStr(initial?.collection_date),
      run_number: initial?.run_number ?? "",
      run_date: dateStr(initial?.run_date),
      city: getVal(cityOptions, initial?.city),
      origin_code: initial?.origin_code ?? "",
      gender: getVal(genderOptions, initial?.gender),
      date_of_birth: dateStr(initial?.date_of_birth),
      country_code: getVal(countryOptions, initial?.country_code),
      origin_id: getVal(origins, initial?.origin),
      sample_source_id: getVal(sampleSources, initial?.sample_source),
      microorganism_id: getVal(microorganisms, initial?.microorganism),
      sequencer_id: getVal(sequencers, initial?.sequencer),
      laboratory_id: getVal(laboratoryOptions, initial?.laboratory),
      health_service_id: getVal(healthServiceOptions, initial?.health_service),
    },
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editSample : dict.newSample}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
  genderDict,
  labOther,
  cityOther,
  healthServiceOther,
  errorsDict,
  initial,
}) => {
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

  if (!countries || !cities || !formOptions || !enumOptions) {
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
      genderDict={genderDict}
      labOther={labOther}
      cityOther={cityOther}
      healthServiceOther={healthServiceOther}
      errorsDict={errorsDict}
      initial={initial}
      countries={countries}
      cities={cities}
      formOptions={formOptions}
      enumOptions={enumOptions}
    />
  );
};

export default SampleFormModal;
