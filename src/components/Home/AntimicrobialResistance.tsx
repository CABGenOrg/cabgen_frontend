import React from "react";
import Section from "../General/Section";
import Link from "next/link";
import OptimizedImage from "../General/OptimizedImage";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
  section_image,
} from "@/styles/tailwind_classes";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const AntimicrobialResistance = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  return (
    <Section id="antimicrobial-resistance">
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={`uppercase ${section_subtitle}`}>
                {Home.AntimicrobialResistance.sectionTitle}
              </span>
              <br />
              <span className={`uppercase ${section_title}`}>
                {Home.AntimicrobialResistance.sectionSubtitle}
              </span>
            </h2>
            <p className={section_text}>
              {Home.AntimicrobialResistance.sectionDescription}
            </p>
          </div>
          <div
            className={`flex md:flex-row flex-col justify-center items-center md:gap-x-2 gap-y-2`}
          >
            <Link
              href="https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance"
              passHref={true}
              target="_blank"
            >
              <button className={section_btn}>
                {Home.AntimicrobialResistance.omsBtn}
              </button>
            </Link>
            <Link
              href="https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/prevencao-e-controle-de-infeccao-e-resistencia-microbiana/pnpciras-e-pan-servicos-de-saude/pan-servicos-de-saude-2023-2027-final-15-12-2023.pdf"
              passHref={true}
              target="_blank"
            >
              <button className={section_btn}>
                {Home.AntimicrobialResistance.nationalPlanBtn}
              </button>
            </Link>
            <Link
              href="https://www.youtube.com/@ConfissoesdeumaBacteria"
              passHref={true}
              target="_blank"
            >
              <button className={section_btn}>
                {Home.AntimicrobialResistance.confessionsOfABacteriaBtn}
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Home/TeriExplicando2.png"}
            alt="bad bacteria"
            className={section_image}
          />
        </div>
      </div>
    </Section>
  );
};

export default AntimicrobialResistance;
