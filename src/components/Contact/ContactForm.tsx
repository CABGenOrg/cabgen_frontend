"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { section_btn } from "@/styles/tailwind_classes";

const ContactFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Insira um e-mail válido."),
  institution: z.string().min(1, "A instituição é obrigatória."),
  subject: z.string().min(1, "O assunto é obrigatório."),
  message: z.string().min(1, "A mensagem é obrigatória."),
});

type FormData = z.infer<typeof ContactFormSchema>;

const ContactForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    reset();
  };

  const input_class =
    "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm";
  const label_class = "block text-base font-semibold leading-6 text-gray-900";

  return (
    <div className="isolate bg-slate-200 rounded-xl m-5 px-6 py-4 sm:py-6 lg:px-8 w-[50%]">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
        Contato
      </h2>
      <p className="mt-2 text-lg leading-8 text-gray-600 text-center font-light">
        Por favor, deixe sua mensagem, dúvida ou sugestão.
      </p>
      <form className="mx-auto mt-6 sm:mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label_class}>
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={input_class}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
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
            <label htmlFor="institution" className={label_class}>
              Instituição
            </label>
            <input
              id="institution"
              type="text"
              {...register("institution")}
              className={input_class}
            />
            {errors.institution && (
              <span className="text-red-600">{errors.institution.message}</span>
            )}
          </div>
          <div>
            <label htmlFor="subject" className={label_class}>
              Assunto
            </label>
            <input
              id="subject"
              type="text"
              {...register("subject")}
              className={input_class}
            />
            {errors.subject && (
              <span className="text-red-600">{errors.subject.message}</span>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="message" className={`${label_class} mt-4`}>
            Mensagem
          </label>
          <textarea
            id="message"
            rows={7}
            {...register("message")}
            className={input_class}
          ></textarea>
          {errors.message && (
            <span className="text-red-600">{errors.message.message}</span>
          )}
        </div>
        <div className="flex justify-center items-center mt-4">
          <button className={section_btn} type="submit">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
