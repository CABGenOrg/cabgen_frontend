import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import CabgenMission from "@/components/About/CabgenMission";
import CabgenPipeline from "@/components/About/CabgenPipeline";
import CabgenResults from "@/components/About/CabgenResults";
import Team from "@/components/About/Team";
import AboutContact from "@/components/About/AboutContact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.About.title} | CABGen` };
}

const About = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  return (
    <>
      <CabgenMission lang={lang} />
      <CabgenPipeline lang={lang} />
      <CabgenResults lang={lang} />
      <Team lang={lang} />
      <AboutContact lang={lang} />
    </>
  );
};

export default About;
