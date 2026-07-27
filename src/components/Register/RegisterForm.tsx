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
import { useLanguage } from "@/redux/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "../ui/form";
import { useGetCountriesQuery } from "@/redux/services/countries/countriesService";
import { useRegisterMutation } from "@/redux/services/auth/authService";
import Loading from "../General/Loading";
import Message from "../General/Message";
import { getTranslateClient } from "@/lib/getTranslateClient";

const RegisterForm = () => {
  const lang = useLanguage();
  const {
    dictionary: { Register, Errors },
  } = getTranslateClient(lang);

  const RegisterFormSchema = z
    .object({
      name: z.string().min(3, Register.nameFieldValidation),
      username: z.string().min(3, Register.usernameFieldValidation),
      email: z
        .string()
        .min(1, Register.emailFieldValidationNull)
        .email(Register.emailFieldValidationValid),
      confirm_email: z
        .string()
        .min(5, Register.confirmEmailFieldValidationNull)
        .email(Register.confirmEmailFieldValidationValid),
      password: z
        .string()
        .min(1, Register.passwordFieldValidationNull)
        .min(8, Register.passwordFieldValidationMinimum),
      confirm_password: z
        .string()
        .min(1, Register.confirmPasswordFieldValidation),
      country_code: z.string().min(1, Register.countryFieldValidation),
      interest: z.string(),
      role: z.string(),
      institution: z.string(),
    })
    .superRefine(({ email, confirm_email }, ctx) => {
      if (email !== confirm_email) {
        ctx.addIssue({
          code: "custom",
          path: ["confirm_email"],
          message: Register.bothEmailFieldsValidation,
        });
      }
    })
    .superRefine(({ password, confirm_password }, ctx) => {
      if (password !== confirm_password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirm_password"],
          message: Register.bothPasswordFieldsValidation,
        });
      }
    });

  type FormData = z.infer<typeof RegisterFormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      country_code: "",
      username: "",
      interest: "",
      institution: "",
      role: "",
      email: "",
      confirm_email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { data: countries = [] } = useGetCountriesQuery(lang);
  const [register, { data, isLoading, error, isSuccess }] = useRegisterMutation();

  const onSubmit: SubmitHandler<FormData> = async (registerData) => {
    await register(registerData);
  };

  return (
    <div className="mx-5 py-5 px-3 2xl:w-[40%] lg:w-[60%] md:w-[75%] bg-slate-200 rounded-lg">
      <div className="flex flex-col justify-center items-center py-6 sm:px-8 px-2">
        <div className="flex flex-row justify-center items-center">
          <OptimizedImage
            src="/Home/signature_cabgen_dark.png"
            alt="Cabgen logo"
            className="object-cover sm:w-6/12 w-2/3 mb-5"
          />
        </div>
        <Form {...form}>
          <form
            className="mx-2 mt-2 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.nameField}
                        <span className="text-red-500 ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="country_code"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.countryField}
                        <span className="text-red-500 ml-0.5">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-black focus-visible:ring-2 focus-visible:ring-cabgen-200 focus-visible:outline-none 2xl:text-xl sm:text-base">
                            <SelectValue
                              placeholder={Register.countryFieldLabel}
                              className={input_class}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={input_class}>
                          {countries.map(({ code, name }) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.usernameField}
                        <span className="text-red-500 ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.interestField}
                      </FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.institutionField}
                      </FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.roleField}
                      </FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.emailField}
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
                  );
                }}
              />
              <FormField
                control={form.control}
                name="confirm_email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.confirmEmailField}
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
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.passwordField}
                        <span className="text-red-500 ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          className={input_class}
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.confirmPasswordField}
                        <span className="text-red-500 ml-0.5">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          className={input_class}
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-center items-center mt-6">
              {!isLoading && (
                <button className={section_btn} type="submit">
                  {Register.registerBtn}
                </button>
              )}
              {isLoading && <Loading />}
            </div>
            <div className="text-center 2xl:text-xl mt-3">
              <p>
                {Register.formFooter1}
                <CustomLink
                  href="/login"
                  className="text-blue-500 hover:text-blue-700"
                >
                  {Register.formFooter2}
                </CustomLink>
              </p>
              {error && (
                <Message
                  msg={
                    typeof error === "string" && error === "internalServer"
                      ? Errors[error]
                      : String(error)
                  }
                  type="error"
                />
              )}
              {isSuccess && data && (
                <Message
                  msg={data.message}
                  type="success"
                />
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
