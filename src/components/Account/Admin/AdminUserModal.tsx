"use client";

import React from "react";
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
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/services/admin/adminUsersService";
import type {
  AdminUserResponse,
  AdminUserInput,
  AdminUserUpdateInput,
} from "@/redux/services/admin/adminUsersService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { emptyToNull } from "@/utils/zodHelpers";

const AdminUserModalBody: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminUserResponse | null;
  errorsDict: Record<string, string>;
  countries: { code: string; name: string }[];
  roleOptions: { value: string; label: string }[];
}> = ({ open, onClose, initial, errorsDict, countries, roleOptions }) => {
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

  const roleOptionsTranslated = roleOptions.map((r) => ({
    value: r.value,
    label: (dict.roleValues as Record<string, string>)[r.value] ?? r.label,
  }));

  const userSchema = z.object({
    name: z.string().min(1, dict.validation.required),
    username: z.string().min(1, dict.validation.required),
    password: isEdit
      ? z.string().optional()
      : z.string().min(1, dict.validation.required),
    country_code: z.string().min(1, dict.validation.required),
    user_role: z.string().min(1, dict.validation.required),
    is_active: z.boolean(),
    interest: emptyToNull,
    role: emptyToNull,
    institution: emptyToNull,
  });

  type UserFormData = z.infer<typeof userSchema>;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initial?.name ?? "",
      username: initial?.username ?? "",
      password: "",
      country_code: initial?.country_code ?? "",
      user_role: initial?.user_role ?? "",
      is_active: initial?.is_active ?? true,
      interest: initial?.interest ?? "",
      role: initial?.role ?? "",
      institution: initial?.institution ?? "",
    },
  });

  const [createUser, { isLoading: creating, error: createError }] =
    useCreateUserMutation();
  const [updateUser, { isLoading: updating, error: updateError }] =
    useUpdateUserMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<UserFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        await updateUser({
          id: initial.id,
          ...data,
        } as AdminUserUpdateInput).unwrap();
      } else {
        await createUser(data as AdminUserInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editUser : dict.newUser}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField name="name" label={dict.name} form={form} required />
            <TextField name="username" label={dict.username} form={form} required />
            <TextField
              name="password"
              label={dict.password}
              form={form}
              type="password"
              required={!isEdit}
            />
            <SelectField
              name="country_code"
              label={dict.country}
              form={form}
              options={countryOptions}
              placeholder={dict.selectPlaceholder}
              required
            />
            <SelectField
              name="user_role"
              label={dict.userRole}
              form={form}
              options={roleOptionsTranslated}
              placeholder={dict.selectPlaceholder}
              required
            />
            <div className="flex items-center gap-2 sm:col-span-2">
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
            <TextField name="interest" label={dict.interest} form={form} />
            <TextField name="role" label={dict.role} form={form} />
            <TextField
              name="institution"
              label={dict.institution}
              form={form}
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
                {isEdit ? dict.save : dict.createUser}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const AdminUserModal: React.FC<{
  open: boolean;
  onClose: () => void;
  lang: string;
  initial?: AdminUserResponse;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, lang, initial, errorsDict }) => {
  const { data: countries, error: countriesError } = useGetCountriesQuery(lang);
  const { data: enumOptions, error: enumOptionsError } =
    useGetEnumSelectOptionsQuery();

  const loadFailed = !!(countriesError || enumOptionsError);
  const roleOptions = (enumOptions?.roles ?? []).map((r) => ({
    value: r.value,
    label: r.label,
  }));

  const isEdit = !!initial;
  const title = isEdit ? "Edit User" : "New User";

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
    <AdminUserModalBody
      open={open}
      onClose={onClose}
      initial={initial}
      errorsDict={errorsDict}
      countries={countries}
      roleOptions={roleOptions}
    />
  );
};

export default AdminUserModal;
