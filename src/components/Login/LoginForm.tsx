"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { section_btn } from "@/styles/tailwind_classes";
import Link from "next/link";
import OptimizedImage from "../General/OptimizedImage";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type FormData = z.infer<typeof LoginFormSchema>;

const input_class =
  "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm";
const label_class = "block text-base font-semibold leading-6 text-gray-900";
const base_height = "h-[450px]";
const form_width = "sm:w-[350px] w-[250px]";
const image_width = "sm:w-[250px] w-[100px]";

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex flex-row justify-center items-center xl:-my-24 lg:-my-16 md:-my-12 -my-20 h-screen mx-auto">
      <div className={`${base_height} ${image_width}`}>
        <OptimizedImage
          src="/Contact/dna-helix-attacked-by-bacteria.jpg"
          alt="bacteria attacking DNA"
          className="object-cover w-full h-full rounded-s-xl"
        />
      </div>
      <div
        className={`flex flex-col justify-center items-center bg-slate-200 rounded-e-xl py-6 sm:px-8 px-4 ${base_height} ${form_width}`}
      >
        <h2 className="font-bold tracking-tight text-gray-900 text-4xl text-center">
          Login
        </h2>
        <form className="mx-2 mt-10 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4">
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
          </div>
          <div className="flex justify-center items-center mt-4">
            <button className={section_btn} type="submit">
              Continuar
            </button>
          </div>
          <div className="text-center mt-3">
            <p>
              Não possui conta?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-700"
              >
                Cadastre-se.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
