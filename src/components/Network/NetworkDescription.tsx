import React from "react";
import Section from "../General/Section";
import {
  section_btn,
  section_image,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
} from "@/styles/tailwind_classes";
import Image from "next/image";

const NetworkDescription = () => {
  return (
    <Section id="network-description" gray>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={`${section_subtitle} uppercase`}>
                Rede Nacional
                <br /> de
              </span>
              <br />
              <span className={`${section_title} uppercase`}>
                Vigilância Genômica
              </span>
            </h2>
            <p className={section_text}>
              A “Rede Nacional de Vigilância Genômica de Bactérias
              Multirresistentes” foi criada para permitir uma compreensão mais
              profunda sobre o cenário da Resistência Antimicrobiana (RAM) no
              Brasil, através da utilização do Sequenciamento Total de Genomas
              (STG), com a intenção de garantir a agilidade no acesso à
              informações amplas e relevantes.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={"/Network/studying_dna_freepik.jpg"}
            alt="scientist looking DNA"
            width={5000}
            height={5000}
            className={`${section_image} rounded-lg`}
          />
        </div>
      </div>
    </Section>
  );
};

export default NetworkDescription;
