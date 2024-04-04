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
import OptimizedImage from "../General/OptimizedImage";

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

  return (
    <div className="mx-5 py-6 px-3 2xl:w-[45%] lg:w-[55%] md:w-[70%] bg-slate-200 rounded-lg">
      <div className="flex flex-col justify-center items-center py-6 sm:px-8 px-4">
        <div className="flex flex-row justify-center items-center">
          <OptimizedImage
            src="/Home/signature_cabgen_dark.png"
            alt="Cabgen logo"
            className="object-cover sm:w-5/12 w-2/3"
          />
        </div>
        <div className="my-3">
          <h2 className={form_title}>Contato</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 text-center font-light">
            Por favor, deixe sua mensagem, dúvida ou sugestão.
          </p>
        </div>
        <form className="mx-2 mt-2 w-full" onSubmit={handleSubmit(onSubmit)}>
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
                <span className="text-red-600">
                  {errors.institution.message}
                </span>
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
    </div>
  );
};

export default ContactForm;
