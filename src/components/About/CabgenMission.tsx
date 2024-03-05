import React from "react";
import Section from "../General/Section";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
} from "@/styles/tailwind_classes";
import Image from "next/image";
import Link from "next/link";

const CabgenMission = () => {
  return (
    <Section id="cabgen-mission" gray>
      <div className={`grid lg:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={`${section_subtitle} uppercase`}>
                Entenda o{" "}
              </span>
              <span className={section_subtitle}>CABGen:</span>
              <br />
              <span className={`${section_title} uppercase`}>
                Missão e Propósito
              </span>
            </h2>
            <p className={section_text}>
              O CABGen surge como uma solução para os desafios enfrentados
              diante do aumento exponencial de dados gerados pelo sequenciamento
              genômico. Em resposta à urgência em combater a resistência
              antimicrobiana e preencher a lacuna entre a geração e análise de
              dados genômicos, o CABGen oferece funcionalidades essenciais, como
              estimativa de cobertura, identificação de espécies e detecção de
              mutações. Essas ferramentas simplificam e aprimoram a análise e
              interpretação de dados biológicos, fornecendo insights valiosos
              para aplicações clínicas.
              <br />
              Ademais, o sistema está em constante evolução para atender às
              demandas crescentes, com planos para a instalação de um novo
              servidor que permitirá até 60 análises em paralelo, além de um
              armazenamento robusto capaz de suportar até 120 mil amostras. A
              segurança do CABGen é garantida tanto pelo firewall da rede do
              Programa de Computação Científica (PROCC) quanto pelas rigorosas
              políticas de segurança da FioCruz.
            </p>
          </div>
          <Link
            href="https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2022.893474/full"
            passHref={true}
            target="_blank"
          >
            <button className={section_btn}>Artigo</button>
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={"/About/science_pixabay.png"}
            alt="scientist on top of books next to a DNA molecule and a microscope"
            width={5000}
            height={5000}
            className="lg:h-[70%] h-auto w-11/12 mt-3"
          />
        </div>
      </div>
    </Section>
  );
};

export default CabgenMission;
