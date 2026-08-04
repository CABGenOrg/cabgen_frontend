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
import { useGetEnumSelectOptionsQuery } from "@/redux/services/select_options/selectOptionsService";
import {
  useCreateHealthServiceMutation,
  useUpdateHealthServiceMutation,
} from "@/redux/services/admin/adminHealthServicesService";
import type {
  AdminHealthServiceTableResponse,
  AdminHealthServiceInput,
} from "@/redux/services/admin/adminHealthServicesService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { emptyToNull } from "@/utils/zodHelpers";
import { getChangedFields } from "@/utils/getChangedFields";

const AdminHealthServiceModalBody: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminHealthServiceTableResponse | null;
  errorsDict: Record<string, string>;
  countries: { code: string; name: string }[];
  typeOptions: { value: string; label: string }[];
}> = ({ open, onClose, initial, errorsDict, countries, typeOptions }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const isEdit = !!initial;

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const typeOptionsTranslated = typeOptions.map((t) => ({
    ...t,
    label:
      (dict.healthServiceTypeValues as Record<string, string>)[t.value] ??
      t.label,
  }));

  const healthServiceSchema = z.object({
    name: z.string().min(1, dict.validation.required),
    type: z.string().min(1, dict.validation.required),
    country_code: z.string().min(1, dict.validation.required),
    city: emptyToNull.optional(),
    contactant: emptyToNull.optional(),
    contact_email: emptyToNull.optional(),
    contact_phone: emptyToNull.optional(),
    is_active: z.boolean(),
  });

  type HealthServiceFormData = z.infer<typeof healthServiceSchema>;

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      name: initial.name ?? "",
      type: initial.type ?? "",
      country_code: initial.country ?? "",
      city: initial.city ?? "",
      contactant: initial.contactant ?? "",
      contact_email: initial.contact_email ?? "",
      contact_phone: initial.contact_phone ?? "",
      is_active: initial.is_active ?? true,
    };
  }, [initial]);

  const form = useForm<HealthServiceFormData>({
    resolver: zodResolver(healthServiceSchema),
    values: initialValues,
  });

  const [createHealthService, { isLoading: creating, error: createError }] =
    useCreateHealthServiceMutation();
  const [updateHealthService, { isLoading: updating, error: updateError }] =
    useUpdateHealthServiceMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;
  const onSubmit: SubmitHandler<HealthServiceFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        const changed = getChangedFields(
          initialValues ?? ({} as HealthServiceFormData),
          data,
        );
        if (Object.keys(changed).length === 0) return;
        await updateHealthService({
          id: initial.id,
          data: changed as Partial<AdminHealthServiceInput>,
        }).unwrap();
      } else {
        await createHealthService(data as AdminHealthServiceInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editHealthService : dict.newHealthService}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField
              name="name"
              label={dict.name}
              form={form}
              required
            />
            <SelectField
              name="type"
              label={dict.type}
              form={form}
              options={typeOptionsTranslated}
              placeholder={dict.selectPlaceholder}
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
            <TextField name="city" label={dict.city} form={form} />
            <TextField name="contactant" label={dict.contactant} form={form} />
            <TextField
              name="contact_email"
              label={dict.contactEmail}
              form={form}
            />
            <TextField
              name="contact_phone"
              label={dict.contactPhone}
              form={form}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                className="h-4 w-4 rounded border-gray-300 text-cabgen-200 focus:ring-cabgen-200"
                {...form.register("is_active")}
              />
              <label htmlFor="is_active" className="text-gray-900">
                {dict.isActive}
              </label>
            </div>
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
                {isEdit ? dict.save : dict.createHealthService}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const AdminHealthServiceModal: React.FC<{
  open: boolean;
  onClose: () => void;
  lang: string;
  initial?: AdminHealthServiceTableResponse;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, lang, initial, errorsDict }) => {
  const { data: countries, error: countriesError } = useGetCountriesQuery(lang);
  const { data: enumOptions, error: enumOptionsError } =
    useGetEnumSelectOptionsQuery();

  const loadFailed = !!(countriesError || enumOptionsError);
  const typeOptions = (enumOptions?.health_service_types ?? []).map((t) => ({
    value: t.value,
    label: t.label,
  }));

  const isEdit = !!initial;
  const title = isEdit ? "Edit Health Service" : "New Health Service";

  if (loadFailed) {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <Message msg={"Failed to load options"} type="error" />
      </Modal>
    );
  }

  if (!countries || !enumOptions) {
    return (
      <Modal open={open} onClose={onClose} title={title}>
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </Modal>
    );
  }

  return (
    <AdminHealthServiceModalBody
      open={open}
      onClose={onClose}
      initial={initial}
      errorsDict={errorsDict}
      countries={countries}
      typeOptions={typeOptions}
    />
  );
};

export default AdminHealthServiceModal;
