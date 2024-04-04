import React from "react";
import Section from "../General/Section";
import { section_spacing } from "@/styles/tailwind_classes";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { Locale } from "@/i18n/i18n.config";

const Banner = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  return (
    <Section
      id="home-banner"
      background="/Home/source.png"
      classToAdd="xl:h-96 md:h-80 h-52"
    >
      <div className="h-full flex items-center text-center">
        <h1
          className={`font-semibold lg:text-7xl md:text-6xl sm:text-4xl xs:text-3xl text-2xl ${section_spacing} bg-white/50 sm:py-2 py-0 sm:px-3 px-0 rounded-lg`}
        >
          {Home.Banner.bannerTitle}
        </h1>
      </div>
    </Section>
  );
};

export default Banner;
