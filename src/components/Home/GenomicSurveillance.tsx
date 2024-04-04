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

const GenomicSurveillance = () => {
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
              REDE NACIONAL DE VIGILÂNCIA GENÔMICA DE{" "}
              <span className="font-bold">
                BACTÉRIAS MULTIRRESISTENTES NO BRASIL
              </span>
            </h2>
            <p className={section_text}>
              Rede que integra laboratórios brasileiros para realização de
              sequenciamento genômico de bactérias produtoras de carbapenemases
              para obtenção de informações relevantes para o controle da
              disseminação desses microrganismos.
            </p>
          </div>
          <CustomLink href="/network">
            <button className={section_btn}>Saiba mais</button>
          </CustomLink>
        </div>
      </div>
    </Section>
  );
};

export default GenomicSurveillance;
