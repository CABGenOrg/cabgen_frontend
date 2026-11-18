import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import TermsContent from "@/components/Terms/TermsContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.TermsOfUse.title} | CABGen` };
}

const TermsOfUsePage = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const { lang } = await params;
  const {
    dictionary: { TermsOfUse },
  } = getTranslateServer(lang);

  return (
    <Section id="terms-of-use" animated className="flex-1">
      <TermsContent
        title={TermsOfUse.title}
        subtitle={TermsOfUse.subtitle}
        sections={TermsOfUse.sections}
      />
    </Section>
  );
};

export default TermsOfUsePage;
