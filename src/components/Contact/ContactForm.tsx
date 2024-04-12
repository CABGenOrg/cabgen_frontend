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
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "../ui/form";
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
  const form = useForm<FormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      institution: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log(data);
    form.reset();
  };

  return (
    <div className="mx-5 py-6 px-3 2xl:w-[45%] lg:w-[55%] md:w-[70%] bg-slate-200 rounded-lg">
      <div className="flex flex-col justify-center items-center py-6 sm:px-8 px-2">
        <div className="flex flex-row justify-center items-center">
          <OptimizedImage
            src="/Home/signature_cabgen_dark.png"
            alt="Cabgen logo"
            className="object-cover sm:w-6/12 w-2/3 mb-5"
          />
        </div>
        <div className="my-3">
          <p className="mt-2 text-lg leading-8 text-gray-600 text-center font-light">
            Por favor, deixe sua mensagem, dúvida ou sugestão.
          </p>
        </div>
        <Form {...form}>
          <form
            className="mx-2 mt-2 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>Nome</FormLabel>
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
                      <FormLabel className={label_class}>E-mail</FormLabel>
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
                name="institution"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>Instituição</FormLabel>
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
                name="subject"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className={label_class}>Assunto</FormLabel>
                      <FormControl>
                        <input type="text" className={input_class} {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className={label_class}>Mensagem</FormLabel>
                    <FormControl>
                      <textarea rows={7} className={input_class} {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                );
              }}
            />
            <div className="flex justify-center items-center mt-4">
              <button className={section_btn} type="submit">
                Enviar
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContactForm;
