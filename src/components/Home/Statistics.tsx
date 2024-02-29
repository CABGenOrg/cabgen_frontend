import React from "react";
import Section from "../General/Section";
import BoxInfo from "./BoxInfo";
import Link from "next/link";
import {
  section_btn,
  section_image,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
} from "@/styles/tailwind_classes";

const Statistics = () => {
  return (
    <Section id="cagben-statistics">
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2 className={section_subtitle}>CABGen em números:</h2>
            <h2 className={`uppercase ${section_title}`}>
              Estatística e Impacto
            </h2>
            <p className={section_text}>
              Desde o seu lançamento, o CABGen tem atraído interesse crescente,
              com um número relevante de genomas submetidos, abordando uma
              variedade de espécies bacterianas. Diveros genes de resistência
              adquirida já foram identificados. O CABGen já recebeu
              contribuições de diferentes países, refletindo sua natureza
              colaborativa e global. Essas estatísticas preliminares destacam o
              potencial do CABGen para impulsionar avanços na pesquisa genômica
              e na saúde pública, fornecendo uma base sólida para futuras e
              descobertas.
            </p>
          </div>
          <Link href="/login">
            <button className={section_btn}>Começar</button>
          </Link>
        </div>
        <div className="flex justify-center items-center mt-4">
          <BoxInfo />
        </div>
      </div>
    </Section>
  );
};

export default Statistics;
