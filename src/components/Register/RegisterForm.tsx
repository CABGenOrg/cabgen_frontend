"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { section_btn, input_class, label_class, form_title } from "@/styles/tailwind_classes";
import CustomLink from "../General/CustomLink";
import OptimizedImage from "../General/OptimizedImage";

const RegisterFormSchema = z
  .object({
    name: z.string().min(1, "O nome é obrigatório."),
    country: z.string().min(1, "O país é obrigatório."),
    institution: z.string().min(1, "A instituição é obrigatória."),
    role: z.string().min(1, "O cargo é obrigatório."),
    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .email("Insira um e-mail válido."),
    confirmEmail: z
      .string()
      .min(1, "Confirme seu e-mail.")
      .email("Insira um e-mail válido."),
    password: z
      .string()
      .min(1, "A senha é obrigatória.")
      .min(8, "A senha precisa de pelo menos 8 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .superRefine(({ email, confirmEmail }, ctx) => {
    if (email !== confirmEmail) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmEmail"],
        message: "Os e-mails não são iguais.",
      });
    }
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "As senhas não são iguais.",
      });
    }
  });

type FormData = z.infer<typeof RegisterFormSchema>;

const base_height = "sm:h-[650px] h-[1050px]";
const form_width = "w-full";
const image_width = "sm:w-[30%] w-[15%]";

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex flex-row justify-center items-center my-3 md:mx-auto mx-2 lg:w-[60%] md:w-[70%]">
      <div className={`${base_height} ${image_width}`}>
        <OptimizedImage
          src="/Contact/dna-helix-attacked-by-bacteria.jpg"
          alt="bacteria attacking DNA"
          className="object-cover w-full h-full rounded-s-xl"
        />
      </div>
      <div
        className={`flex flex-col justify-center items-center bg-slate-200 rounded-e-xl py-3 sm:px-8 px-4 ${base_height} ${form_width}`}
      >
        <h2 className={form_title}>
          Cadastro
        </h2>
        <form className="mx-2 mt-10 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="name" className={label_class}>
                Nome
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={input_class}
              />
              {errors.name && (
                <span className="text-red-600">{errors.name.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="country" className={label_class}>
                País
              </label>
              <input
                type="text"
                id="country"
                {...register("country")}
                className={input_class}
              />
              {errors.country && (
                <span className="text-red-600">{errors.country.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="institution" className={label_class}>
                Instituição
              </label>
              <input
                type="text"
                id="institution"
                {...register("institution")}
                className={input_class}
              />
              {errors.institution && (
                <span className="text-red-600">
                  {errors.institution.message}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="role" className={label_class}>
                Cargo
              </label>
              <input
                type="text"
                id="role"
                {...register("role")}
                className={input_class}
              />
              {errors.role && (
                <span className="text-red-600">{errors.role.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="email" className={label_class}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={input_class}
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="confirmEmail" className={label_class}>
                Confirme o e-mail
              </label>
              <input
                id="confirmEmail"
                type="email"
                {...register("confirmEmail")}
                className={input_class}
              />
              {errors.confirmEmail && (
                <span className="text-red-600">
                  {errors.confirmEmail.message}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="password" className={label_class}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={input_class}
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className={label_class}>
                Confirme a senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={input_class}
              />
              {errors.confirmPassword && (
                <span className="text-red-600">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center mt-6">
            <button className={section_btn} type="submit">
              Continuar
            </button>
          </div>
          <div className="text-center mt-3">
            <p>
              Já possui conta?{" "}
              <CustomLink
                href="/login"
                className="text-blue-500 hover:text-blue-700"
              >
                Faça login.
              </CustomLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
