"use client";

import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";
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
import { countryOptions, getCountries } from "@/lib/getCountries";
import { useRegisterMutation } from "@/redux/services/authService";
import { serialize } from "object-to-formdata";
import Loading from "../General/Loading";
import { useRouter } from "next/navigation";
import Message from "../General/Message";
import { getTranslateClient } from "@/lib/getTranslateClient";

const RegisterForm = () => {
  const lang = useSelector(selectCurrentLanguage);
  const {
    dictionary: { Register },
  } = getTranslateClient(lang);

  const RegisterFormSchema = z
    .object({
      name: z.string().min(3, Register.nameFieldValidation),
      country: z.string().refine((value) => countryOptions.includes(value), {
        message: Register.countryFieldValidation,
      }),
      username: z.string().min(3, Register.usernameFieldValidation),
      interest: z.string(),
      institution: z.string(),
      role: z.string(),
      email: z
        .string()
        .min(1, Register.emailFieldValidationNull)
        .email(Register.emailFieldValidationValid),
      confirmEmail: z
        .string()
        .min(5, Register.confirmEmailFieldValidationNull)
        .email(Register.confirmEmailFieldValidationValid),
      password: z
        .string()
        .min(1, Register.passwordFieldValidationNull)
        .min(8, Register.passwordFieldValidationMinimum),
      confirmPassword: z
        .string()
        .min(1, Register.confirmPasswordFieldValidation),
    })
    .superRefine(({ email, confirmEmail }, ctx) => {
      if (email !== confirmEmail) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmEmail"],
          message: Register.bothEmailFieldsValidation,
        });
      }
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: Register.bothPasswordFieldsValidation,
        });
      }
    });

  type FormData = z.infer<typeof RegisterFormSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      country: "",
      username: "",
      interest: "",
      institution: "",
      role: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const language = useSelector(selectCurrentLanguage);
  const countries = getCountries(language);
  const router = useRouter();

  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

  const onSubmit: SubmitHandler<FormData> = async (registerData: FormData) => {
    const parsedRegisterData = {
      nome: registerData.name,
      codigoPais: registerData.country,
      usuario: registerData.username,
      interesse: registerData.interest,
      instituicao: registerData.institution,
      posicao: registerData.role,
      email: registerData.email,
      confirmEmail: registerData.confirmEmail,
      senha: registerData.password,
      confirmPassword: registerData.confirmPassword,
    };
    const formData = serialize(parsedRegisterData);
    await register(formData);
  };

  useEffect(() => {
    if (isSuccess && !error) {
      form.reset();
      router.push("/login");
    }
  }, [isSuccess, error, form, router]);

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
                name="country"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.countryField}
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="text-black focus-visible:ring-transparent 2xl:text-xl sm:text-sm">
                            <SelectValue
                              placeholder={Register.countryFieldLabel}
                              className={input_class}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={input_class}>
                          {countries.map(({ code, country }) => (
                            <SelectItem key={code} value={code}>
                              {country}
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
                      </FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          className={input_class}
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
                name="confirmEmail"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.confirmEmailField}
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
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.passwordField}
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          className={input_class}
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
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {Register.confirmPasswordField}
                      </FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          className={input_class}
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
              {error && <Message msg={String(error)} type="error" />}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
