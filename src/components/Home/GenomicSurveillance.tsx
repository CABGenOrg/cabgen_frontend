import React from "react";
import Section from "../General/Section";
import Link from "next/link";
import Image from "next/image";
import {
  section_btn,
  section_image,
  section_spacing,
  section_subtitle,
  section_text,
} from "@/styles/tailwind_classes";

const GenomicSurveillance = () => {
  return (
    <Section id="cagben-description" gray>
      <div
        className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}
      >
        <div className="flex justify-center items-center">
          <Image
            src={"/Home/connections.png"}
            alt="bacteria pool"
            width={5000}
            height={5000}
            className={section_image}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2 className={`${section_subtitle} uppercase`}>
              REDE NACIONAL DE VIGILÂNCIA GENÔMICA DE{" "}
              <span className="font-bold">
                BACTÉRIAS MULTIRRESISTENTES DO BRASIL
              </span>
            </h2>
            <p className={section_text}>
              Rede que integra laboratórios brasileiros para realização de
              sequenciamento genômico de bactérias produtoras de carbapenemases
              para obtenção de informações relevantes para o controle da
              disseminação desses microrganismos.
            </p>
          </div>
          <Link href="/network">
            <button className={section_btn}>Saiba mais</button>
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default GenomicSurveillance;
