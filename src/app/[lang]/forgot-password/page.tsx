import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import ForgotPasswordForm from "@/components/ForgotPassword/ForgotPasswordForm";
import { form_spacing } from "@/styles/tailwind_classes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.ForgotPassword.title} | CABGen` };
}

const ForgotPassword = () => {
  return (
    <Section id="forgot-password" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <ForgotPasswordForm />
      </div>
    </Section>
  );
};

export default ForgotPassword;
