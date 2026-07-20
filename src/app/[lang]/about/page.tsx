import React from "react";
import CabgenMission from "@/components/About/CabgenMission";
import CabgenPipeline from "@/components/About/CabgenPipeline";
import CabgenResults from "@/components/About/CabgenResults";
import Team from "@/components/About/Team";
import AboutContact from "@/components/About/AboutContact";
import { Locale } from "@/i18n/i18n.config";

const About = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  return (
    <>
      <CabgenMission lang={lang}/>
      <CabgenPipeline lang={lang}/>
      <CabgenResults lang={lang}/>
      <Team lang={lang}/>
      <AboutContact lang={lang}/>
    </>
  );
};

export default About;
