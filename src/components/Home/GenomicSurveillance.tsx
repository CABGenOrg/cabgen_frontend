import React from "react";
import Section from "../General/Section";
import CustomLink from "../General/CustomLink";
import OptimizedImage from "../General/OptimizedImage";
import {
  section_btn,
  section_image,
  section_spacing,
  section_subtitle,
  section_text,
} from "@/styles/tailwind_classes";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const GenomicSurveillance = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  return (
    <Section id="genomic-surveillance" gray>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex justify-center items-center sm:order-first order-last">
          <OptimizedImage
            src={"/Home/rede_simbolo.png"}
            alt="genomic network symbol"
            className={section_image}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2 className={`${section_subtitle} uppercase`}>
              {Home.GenomicSurveillance.sectionTitle}{" "}
              <span className="font-bold">
                {Home.GenomicSurveillance.sectionSubtitle}
              </span>
            </h2>
            <p className={section_text}>
              {Home.GenomicSurveillance.sectionDescription}
            </p>
          </div>
          <CustomLink href="/network">
            <button className={section_btn}>{Home.GenomicSurveillance.learMoreBtn}</button>
          </CustomLink>
        </div>
      </div>
    </Section>
  );
};

export default GenomicSurveillance;
