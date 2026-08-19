import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import ContactForm from "@/components/Contact/ContactForm";
import { form_spacing } from "@/styles/tailwind_classes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.Contact.title} | CABGen` };
}

const Contact = () => {
  return (
    <Section id="contact" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;
