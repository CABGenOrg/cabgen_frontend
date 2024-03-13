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

const AntimicrobialResistance = () => {
  return (
    <Section id="antimicrobial-resistance">
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={`uppercase ${section_subtitle}`}>O que é</span>
              <br />
              <span className={`uppercase ${section_title}`}>
                Resistência Antimicrobiana
              </span>
            </h2>
            <p className={section_text}>
              A resistência antimicrobiana (RAM) representa uma ameaça global à
              eficácia dos tratamentos para infecções causadas por
              microrganismos como vírus, bactérias, fungos e parasitas. Essa
              resistência surge quando esses microrganismos sofrem mutações ou
              adquirem novos genes que os tornam resistentes ào tratamento.
              Patógenos bacterianos prevalentes em hospitais apresentam taxas
              preocupantes de resistência, prolongando as infecções, aumentando
              o risco de propagação e os custos hospitalares. Esse cenário exige
              ação conjunta de todos os setores da sociedade e do governo. A RAM
              não reconhece fronteiras e afeta não apenas a saúde humana, mas
              também a saúde animal, a produtividade agrícola e a segurança
              alimentar.
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-10">
            <Link
              href="https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance"
              passHref={true}
              target="_blank"
            >
              <button className={section_btn}>OMS</button>
            </Link>
            <Link
              href="https://www.gov.br/anvisa/pt-br/assuntos/servicosdesaude/prevencao-e-controle-de-infeccao-e-resistencia-microbiana/pnpciras-e-pan-servicos-de-saude/pan-servicos-de-saude-2023-2027-final-15-12-2023.pdf"
              passHref={true}
              target="_blank"
            >
              <button className={section_btn}>Plano Nacional</button>
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
