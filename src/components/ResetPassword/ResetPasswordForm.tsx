"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  section_btn,
  label_class,
} from "@/styles/tailwind_classes";
import CustomLink from "../General/CustomLink";
import { useResetPasswordMutation } from "@/redux/services/auth/authService";
import Loading from "../General/Loading";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "../ui/form";
import Message from "../General/Message";
import PasswordInput from "../General/PasswordInput";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const lang = useLanguage();
  const {
    dictionary: { ResetPassword, Errors },
  } = getTranslateClient(lang);

  const schema = z
    .object({
      new_password: z
        .string()
        .min(1, ResetPassword.confirmPasswordFieldValidation)
        .min(8, ResetPassword.newPasswordFieldValidationMinimum),
      confirm_password: z
        .string()
        .min(1, ResetPassword.confirmPasswordFieldValidation),
    })
    .superRefine(({ new_password, confirm_password }, ctx) => {
      if (new_password !== confirm_password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirm_password"],
          message: ResetPassword.bothPasswordFieldsValidation,
        });
      }
    });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await resetPassword({
      token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Message msg={ResetPassword.success} type="success" />
        <CustomLink
          href="/login"
          className="text-blue-500 hover:text-blue-700"
        >
          {ResetPassword.backToLogin}
        </CustomLink>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="mx-2 w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4">
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={label_class}>
                  {ResetPassword.newPasswordField}
                  <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput field={field} autoComplete="new-password" />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={label_class}>
                  {ResetPassword.confirmPasswordField}
                  <span className="text-red-500 ml-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <PasswordInput field={field} autoComplete="new-password" />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center items-center mt-4">
          {!isLoading && (
            <button className={section_btn} type="submit">
              {ResetPassword.button}
            </button>
          )}
          {isLoading && <Loading />}
        </div>
        {error && (
          <div className="mt-3">
            <Message
              msg={
                typeof error === "string" && error === "internalServer"
                  ? Errors[error]
                  : String(error)
              }
              type="error"
            />
          </div>
        )}
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
