import React from "react";
import Banner from "@/components/Home/Banner";
import CabgenDescription from "@/components/Home/CabgenDescription";
import Statistics from "@/components/Home/Statistics";
import GenomicSurveillance from "@/components/Home/GenomicSurveillance";
import AntimicrobialResistance from "@/components/Home/AntimicrobialResistance";
import Financiers from "@/components/Home/Financiers";
import { Locale } from "@/i18n/i18n.config";
import WarningBanner from "@/components/Home/WarningBanner";

const showWarning = process.env.NEW_DOMAIN_WARNING === "true";

const Home = ({ params: { lang } }: { params: { lang: Locale } }) => {
  return (
    <>
      {showWarning && <WarningBanner lang={lang} />}
      <Banner lang={lang} />
      <CabgenDescription lang={lang} />
      <Statistics lang={lang} />
      <GenomicSurveillance lang={lang} />
      <AntimicrobialResistance lang={lang} />
      <Financiers lang={lang} />
    </>
  );
};

export default Home;
