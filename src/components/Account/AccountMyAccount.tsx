"use client";

import React, { useMemo, useState } from "react";
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
import { SmartSelect } from "@/components/General/SmartSelect";
import { section_btn, input_class, label_class } from "@/styles/tailwind_classes";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/services/users/usersService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { emptyToNull } from "@/utils/zodHelpers";

const AccountMyAccount = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.myAccount;

  const { data: profile, isLoading: loadingProfile, error: profileError } = useGetProfileQuery();
  const { data: countries } = useGetCountriesQuery(lang);
  const [saved, setSaved] = useState(false);

  const [updateProfile, { isLoading: updating, error: updateError }] = useUpdateProfileMutation();

  const countryOptions = (countries ?? []).map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const profileSchema = z.object({
    name: emptyToNull,
    username: emptyToNull,
    country_code: emptyToNull,
    institution: emptyToNull,
    role: emptyToNull,
    interest: emptyToNull,
  });

  type ProfileFormData = z.infer<typeof profileSchema>;

  const profileValues = useMemo(() => {
    if (!profile) return undefined;
    return {
      name: profile.name ?? "",
      username: profile.username ?? "",
      country_code: profile.country_code ?? "",
      institution: profile.institution ?? "",
      role: profile.role ?? "",
      interest: profile.interest ?? "",
    };
  }, [profile]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profileValues,
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const changed: Record<string, string | null> = {};
      if (data.name !== (profileValues?.name ?? "")) changed.name = data.name;
      if (data.username !== (profileValues?.username ?? "")) changed.username = data.username;
      if (data.country_code !== (profileValues?.country_code ?? "")) changed.country_code = data.country_code;
      if (data.institution !== (profileValues?.institution ?? "")) changed.institution = data.institution;
      if (data.role !== (profileValues?.role ?? "")) changed.role = data.role;
      if (data.interest !== (profileValues?.interest ?? "")) changed.interest = data.interest;

      if (Object.keys(changed).length === 0) return;
      await updateProfile(changed as any).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center py-16">
        <Loading />
      </div>
    );
  }

  if (profileError) {
    return <Message msg={Errors.internalServer} type="error" />;
  }

  const roleBadge =
    profile?.user_role === "Admin"
      ? "bg-blue-100 text-blue-700"
      : profile?.user_role === "Collaborator"
        ? "bg-green-100 text-green-700"
        : "bg-cabgen-100 text-white";

  const roleLabel =
    profile?.user_role === "Admin"
      ? dict.roleAdmin
      : profile?.user_role === "Collaborator"
        ? dict.roleCollaborator
        : profile?.user_role ?? "";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-5">{dict.title}</h1>

      {profile && (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">{dict.email}</span>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">{dict.role}</span>
              <p>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-base font-medium ${roleBadge}`}>
                  {roleLabel}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-medium mb-4">{dict.editProfile}</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.name}</FormLabel>
                    <FormControl>
                      <input className={input_class} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.username}</FormLabel>
                    <FormControl>
                      <input className={input_class} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.country}</FormLabel>
                    <FormControl>
                      <SmartSelect
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        options={countryOptions}
                        placeholder={dict.selectPlaceholder}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.institution}</FormLabel>
                    <FormControl>
                      <input className={input_class} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.position}</FormLabel>
                    <FormControl>
                      <input className={input_class} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>{dict.interest}</FormLabel>
                    <FormControl>
                      <input className={input_class} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            {updateError && (
              <div className="mt-4">
                <Message
                  msg={typeof updateError === "string" && updateError === "internalServer" ? Errors[updateError] : String(updateError)}
                  type="error"
                />
              </div>
            )}

            {saved && (
              <div className="mt-4">
                <Message msg={dict.saveSuccess} type="success" />
              </div>
            )}

            <div className="flex justify-end mt-6">
              {updating ? (
                <Loading />
              ) : (
                <button type="submit" className={section_btn}>
                  {dict.save}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountMyAccount;
