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
import OptimizedImage from "../General/OptimizedImage";
import CustomLink from "../General/CustomLink";

const NetworkDescription = () => {
  return (
    <Section id="network-description" gray>
      <div className={`${section_spacing}`}>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/logo_rede_dark.png"}
            alt="network dark logo"
            className="object-cover sm:w-5/6 w-auto"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className={section_text}>
            A rede reúne especialistas em resistência antimicrobiana (RAM) e
            bioinformática de diferentes unidades da Fiocruz, LACEN e CGLAB-MS,
            tendo como foco principal a estruturação, capacitação, análise e
            interpretação de dados de sequenciamento total de genomas de
            bactérias multirresistentes. Essa iniciativa permitirá a compreensão
            mais profunda sobre o cenário da RAM no Brasil, com a intenção de
            garantir agilidade para futuras ações no controle da disseminação
            desses microrganismos.
          </p>
        </div>
      </div>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/curso_rede.jpeg"}
            alt="person pipetting into a plate"
            className={`${section_image} rounded-lg`}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <p className={section_text}>
              Cada laboratório participante da rede realiza o sequenciamento de
              forma independente, e as análises dos dados gerados são
              padronizadas e automatizadas através do CABGen. As informações
              geradas pelos integrantes da rede estão disponíveis de forma
              visual e interativa no CABGen, permitindo a comunicação dos
              resultados para a comunidade científica e profissionais da saúde.
            </p>
          </div>
        </div>
      </div>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center sm:order-first order-last">
          <div className="flex flex-col justify-center items-start">
            <p className={section_text}>
              O foco inicial da rede é o estudo das espécies de bacilos
              gram-negativos multirresistentes (
              <span className="italic">
                Pseudomonas aeruginosa, Acinetobacter baumannni e Klebsiella
                pneumoniae
              </span>
              ), produtores de carbapenemases. Essas amostras são incluídas na
              Coleção de Culturas de Bactérias de Origem Hospitalar (CCBH/IOC -
              WDCM 947), para preservação das culturas bacterianas. Além disso,
              os dados genômicos ficam protegidos em um servidor próprio
              hospedado na Fiocruz/RJ, em uma sala cofre certificada segundo a
              NBR 15247. A rede está aberta para formalização de novos
              parceiros. Caso tenho interesse entrar em contato.
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-10">
            <CustomLink href="/contact">
              <button className={section_btn}>Contato</button>
            </CustomLink>
            <CustomLink href="/dashboard">
              <button className={section_btn}>Dashboard</button>
            </CustomLink>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/capacitacao_rede.jpeg"}
            alt="people in a room"
            className={`${section_image} rounded-lg`}
          />
        </div>
      </div>
    </Section>
  );
};

export default NetworkDescription;
