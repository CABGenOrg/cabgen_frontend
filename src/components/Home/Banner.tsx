import React from "react";
import Section from "../General/Section";
import { section_spacing } from "@/styles/tailwind_classes";

const Banner = () => {
  return (
    <Section
      id="home-banner"
      background="/Home/source.png"
      classToAdd="xl:h-96 md:h-80 h-52"
    >
      <div className="h-full flex items-center text-center">
        <h1
          className={`font-semibold lg:text-6xl md:text-5xl sm:text-3xl xs:text-2xl text-xl ${section_spacing} bg-white/50 sm:py-2 py-0 sm:px-3 px-0 rounded-lg`}
        >
          CABGen: Genômica Bacteriana Aplicada à Clínica
        </h1>
      </div>
    </Section>
  );
};

export default Banner;
