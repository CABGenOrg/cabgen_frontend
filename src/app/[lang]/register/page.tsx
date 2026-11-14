import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import RegisterForm from "@/components/Register/RegisterForm";
import { form_spacing } from "@/styles/tailwind_classes";
import RedirectIfAuthenticated from "@/components/Account/RedirectIfAuthenticated";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.Register.title} | CABGen` };
}

const Register = () => {
  return (
    <>
      <RedirectIfAuthenticated />
      <Section id="register" className="flex-1">
        <div className={`${form_spacing} flex-1`}>
          <RegisterForm />
        </div>
      </Section>
    </>
  );
};

export default Register;
