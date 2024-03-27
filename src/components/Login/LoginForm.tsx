"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  section_btn,
  input_class,
  label_class,
  form_title,
} from "@/styles/tailwind_classes";
import CustomLink from "../General/CustomLink";
import OptimizedImage from "../General/OptimizedImage";
import { useRouter } from "next/navigation";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type FormData = z.infer<typeof LoginFormSchema>;

const base_height = "2xl:h-[650px] h-[450px]";
const form_width = "w-[50%]";
const image_width = "sm:w-[40%] w-[25%]";

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    reset();
    router.push("/account");
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
        className={`flex flex-col justify-center items-center bg-slate-200 rounded-e-xl py-6 sm:px-8 px-4 ${base_height} ${form_width}`}
      >
        <h2 className={form_title}>Login</h2>
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
              <CustomLink
                href="/register"
                className="text-blue-500 hover:text-blue-700"
              >
                Cadastre-se.
              </CustomLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
