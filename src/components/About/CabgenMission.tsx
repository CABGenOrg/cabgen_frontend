import React from "react";
import Section from "../General/Section";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
} from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";
import Link from "next/link";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const CabgenMission = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { About },
  } = getTranslateServer(lang);

  return (
    <Section id="cabgen-mission" gray>
      <div className={`grid lg:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={`${section_subtitle} uppercase`}>
                {About.CabgenMission.sectionTitle}
              </span>
              <span className={section_subtitle}>CABGen:</span>
              <br />
              <span className={`${section_title} uppercase`}>
                {About.CabgenMission.sectionSubtitle}
              </span>
            </h2>
            <p className={section_text}>
              {About.CabgenMission.sectionDescriptionFirstParagraph}
              <br />
              {About.CabgenMission.sectionDescriptionSecondParagraph}
            </p>
          </div>
          <Link
            href="https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2022.893474/full"
            passHref={true}
            target="_blank"
          >
            <button className={section_btn}>
              {About.CabgenMission.articleBtn}
            </button>
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/About/CABGen_Simbolo.png"}
            alt="CABGen logo"
            className="rotate-90 lg:w-auto lg:h-auto w-4/5 h-4/5"
          />
        </div>
      </div>
    </Section>
  );
};

export default CabgenMission;
