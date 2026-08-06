"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  section_btn,
  input_class,
  label_class,
} from "@/styles/tailwind_classes";
import CustomLink from "../General/CustomLink";
import OptimizedImage from "../General/OptimizedImage";
import { useForgotPasswordMutation } from "@/redux/services/auth/authService";
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
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

const ForgotPasswordForm = () => {
  const lang = useLanguage();
  const {
    dictionary: { ForgotPassword, Errors },
  } = getTranslateClient(lang);

  const schema = z.object({
    email: z
      .string()
      .min(1, ForgotPassword.emailFieldValidation)
      .email(ForgotPassword.emailFieldValidation),
  });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await forgotPassword(data);
  };

  return (
    <div className="mx-5 py-10 px-5 2xl:w-[30%] lg:w-[40%] md:w-[60%] bg-slate-200 rounded-lg">
      <div className="flex flex-col justify-center items-center py-6 sm:px-8 px-2">
        <div className="flex flex-row justify-center items-center">
          <OptimizedImage
            src="/Home/signature_cabgen_dark.png"
            alt="Cabgen logo"
            className="object-cover sm:w-6/12 w-2/3 mb-5"
          />
        </div>
        <h1 className="text-xl font-semibold mb-2">{ForgotPassword.title}</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          {ForgotPassword.description}
        </p>
        {isSuccess ? (
          <Message msg={ForgotPassword.success} type="success" />
        ) : (
          <Form {...form}>
            <form className="mx-2 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {ForgotPassword.emailField}
                      <span className="text-red-500 ml-0.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        className={input_class}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center mt-4">
                {!isLoading && (
                  <button className={section_btn} type="submit">
                    {ForgotPassword.button}
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
        )}
        <div className="text-center mt-4">
          <CustomLink
            href="/login"
            className="text-blue-500 hover:text-blue-700"
          >
            {ForgotPassword.backToLogin}
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
