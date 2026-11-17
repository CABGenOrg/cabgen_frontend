import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import FaqAccordion from "@/components/FAQ/FaqAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.FAQ.title} | CABGen` };
}

const FAQPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  const {
    dictionary: { FAQ },
  } = getTranslateServer(lang);

  return (
    <Section id="faq" animated className="flex-1">
      <FaqAccordion
        title={FAQ.title}
        subtitle={FAQ.subtitle}
        sections={FAQ.sections}
      />
    </Section>
  );
};

export default FAQPage;
