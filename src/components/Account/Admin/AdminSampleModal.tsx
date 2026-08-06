"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Modal from "@/components/General/Modal";
import TextField from "@/components/General/TextField";
import SelectField from "@/components/General/SelectField";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useGetCitiesQuery } from "@/redux/services/cities/citiesService";
import {
  useGetFormSelectOptionsQuery,
  useGetEnumSelectOptionsQuery,
} from "@/redux/services/select_options/selectOptionsService";
import {
  useCreateAdminSampleMutation,
  useUpdateAdminSampleMutation,
} from "@/redux/services/admin/adminSamplesService";
import type {
  AdminSampleInput,
} from "@/redux/services/admin/adminSamplesService";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { emptyToNull } from "@/utils/zodHelpers";
import { getChangedFields } from "@/utils/getChangedFields";

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

type AdminSampleModalProps = {
  open: boolean;
  onClose: () => void;
  errorsDict: Record<string, string>;
  initial?: SampleResponse | null;
};

const AdminSampleModalBody: React.FC<
  AdminSampleModalProps & {
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
> = ({ open, onClose, errorsDict, initial, countries, cities, formOptions, enumOptions }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const seqDict = AccountDict.sequences;
  const genderDict: Record<string, string> = AccountDict.option.gender;
  const isEdit = !!initial;

  const sampleSchema = z.object({
    name: z.string().min(1, adminDict.validation.required),
    collection_date: z.string().min(1, adminDict.validation.required),
    run_number: z.string().min(1, adminDict.validation.required),
    run_date: z.string().min(1, adminDict.validation.required),
    city: emptyToNull.optional(),
    origin_code: emptyToNull.optional(),
    gender: emptyToNull.optional(),
    date_of_birth: emptyToNull.optional(),
    country_code: z.string().min(1, adminDict.validation.required),
    origin_id: z.string().min(1, adminDict.validation.required),
    sample_source_id: z.string().min(1, adminDict.validation.required),
    microorganism_id: z.string().min(1, adminDict.validation.required),
    sequencer_id: z.string().min(1, adminDict.validation.required),
    laboratory_id: z.string().min(1, adminDict.validation.required),
    health_service_id: z.string().min(1, adminDict.validation.required),
  });

  type SampleFormData = z.infer<typeof sampleSchema>;

  const genderOptions = (enumOptions.genders ?? []).map((g) => ({
    ...g,
    label: genderDict[g.value.toLowerCase()] ?? g.label,
  }));

  const laboratoryOptions = (formOptions.laboratories ?? []).map((o) => ({
    ...o,
    label:
      o.label === "option.laboratory.other"
        ? AccountDict.option.laboratory.other
        : o.label,
  }));

  const cityOptions = (cities ?? []).map((o) => ({
    ...o,
    label:
      o.label === "option.city.other" ? AccountDict.option.city.other : o.label,
  }));

  const healthServiceOptions = (formOptions.health_services ?? []).map((o) => ({
    ...o,
    label:
      o.label === "option.healthService.other"
        ? AccountDict.option.healthService.other
        : o.label,
  }));

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const origins = formOptions.origins ?? [];
  const microorganisms = formOptions.microorganisms ?? [];
  const sampleSources = formOptions.sample_sources ?? [];
  const sequencers = formOptions.sequencers ?? [];

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      name: initial.name ?? "",
      collection_date: dateStr(initial.collection_date),
      run_number: initial.run_number ?? "",
      run_date: dateStr(initial.run_date),
      city: getVal(cityOptions, initial.city),
      origin_code: initial.origin_code ?? "",
      gender: getVal(genderOptions, initial.gender),
      date_of_birth: dateStr(initial.date_of_birth),
      country_code: getVal(countryOptions, initial.country_code),
      origin_id: getVal(origins, initial.origin),
      sample_source_id: getVal(sampleSources, initial.sample_source),
      microorganism_id: getVal(microorganisms, initial.microorganism),
      sequencer_id: getVal(sequencers, initial.sequencer),
      laboratory_id: getVal(laboratoryOptions, initial.laboratory),
      health_service_id: getVal(healthServiceOptions, initial.health_service),
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
  ]);

  const form = useForm<SampleFormData>({
    resolver: zodResolver(sampleSchema),
    values: initialValues,
  });

  const [createSample, { isLoading: creating, error: createError }] =
    useCreateAdminSampleMutation();
  const [updateSample, { isLoading: updating, error: updateError }] =
    useUpdateAdminSampleMutation();

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
        await updateSample({
          id: initial.id,
          data: changed as Partial<AdminSampleInput>,
        }).unwrap();
      } else {
        await createSample(data as AdminSampleInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? adminDict.editSample : adminDict.newSample}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField name="name" label={seqDict.name} form={form} required />
            <SelectField
              name="country_code"
              label={seqDict.country}
              form={form}
              options={countryOptions}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <TextField
              name="collection_date"
              label={seqDict.collectionDate}
              form={form}
              type="date"
              required
            />
            <TextField
              name="run_number"
              label={seqDict.runNumber}
              form={form}
              required
            />
            <TextField
              name="run_date"
              label={seqDict.runDate}
              form={form}
              type="date"
              required
            />
            <TextField name="origin_code" label={seqDict.originCode} form={form} />
            <SelectField
              name="gender"
              label={seqDict.gender}
              form={form}
              options={genderOptions}
              placeholder={adminDict.selectPlaceholder}
            />
            <TextField
              name="date_of_birth"
              label={seqDict.dateOfBirth}
              form={form}
              type="date"
            />
            <SelectField
              name="origin_id"
              label={seqDict.origin}
              form={form}
              options={origins}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="sample_source_id"
              label={seqDict.sampleSource}
              form={form}
              options={sampleSources}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="microorganism_id"
              label={seqDict.microorganism}
              form={form}
              options={microorganisms}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="sequencer_id"
              label={seqDict.sequencer}
              form={form}
              options={sequencers}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="laboratory_id"
              label={seqDict.laboratory}
              form={form}
              options={laboratoryOptions}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="health_service_id"
              label={seqDict.healthService}
              form={form}
              options={healthServiceOptions}
              placeholder={adminDict.selectPlaceholder}
              required
            />
            <SelectField
              name="city"
              label={seqDict.city}
              form={form}
              options={cityOptions}
              placeholder={adminDict.selectPlaceholder}
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
                {isEdit ? adminDict.save : adminDict.createSample}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const AdminSampleModal: React.FC<AdminSampleModalProps> = ({
  open,
  onClose,
  errorsDict,
  initial,
}) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const title = initial ? adminDict.editSample : adminDict.newSample;
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
      <Modal open={open} onClose={onClose} title={title}>
        <Message msg={"Failed to load options"} type="error" />
      </Modal>
    );
  }

  if (!countries || !cities || !formOptions || !enumOptions) {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </Modal>
    );
  }

  return (
    <AdminSampleModalBody
      open={open}
      onClose={onClose}
      errorsDict={errorsDict}
      initial={initial}
      countries={countries}
      cities={cities}
      formOptions={formOptions}
      enumOptions={enumOptions}
    />
  );
};

export default AdminSampleModal;
