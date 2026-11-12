import React from "react";
import Section from "../General/Section";
import {
  section_spacing,
  section_subtitle,
  section_title,
} from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const CabgenPipeline = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { About },
  } = getTranslateServer(lang);
  return (
    <Section id="cabgen-pipeline" animated>
      <div className={section_spacing}>
        <h2 className="text-center mb-3 md:text-3xl text-2xl">
          <span className={`${section_subtitle} uppercase`}>
            {About.CabgenPipeline.sectionTitle}
          </span>
          <span className={section_title}>CABGen</span>
        </h2>
        <OptimizedImage
          src="/About/cabgen_pipeline.svg"
          alt="cabgen pipeline"
          width={1400}
          height={700}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="w-full max-w-5xl mx-auto"
        />
      </div>
    </Section>
  );
};

export default CabgenPipeline;
