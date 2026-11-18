import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import PrivacyContent from "@/components/Privacy/PrivacyContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.PrivacyPolicy.title} | CABGen` };
}

const PrivacyPolicyPage = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const { lang } = await params;
  const {
    dictionary: { PrivacyPolicy },
  } = getTranslateServer(lang);

  return (
    <Section id="privacy-policy" animated className="flex-1">
      <PrivacyContent
        title={PrivacyPolicy.title}
        subtitle={PrivacyPolicy.subtitle}
        sections={PrivacyPolicy.sections}
        contactHint={PrivacyPolicy.contactHint}
        contactLink={PrivacyPolicy.contactLink}
      />
    </Section>
  );
};

export default PrivacyPolicyPage;
