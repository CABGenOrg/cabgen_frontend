import React from "react";
import Section from "../General/Section";
import { Card, CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { section_spacing } from "@/styles/tailwind_classes";

interface CardInfo {
  text: string;
  button?: { btn_link: string; btn_name: string };
}

const NetworkPurposes = () => {
  const data: CardInfo[] = [
    {
      text: "Capacitação dos LACENs participantes para realização do STG de bactérias em suas unidades.",
    },
    {
      text: "Foco em bacilos gram-negativos produtores de carbapenemase isolados de hemocultura.",
    },
    {
      text: "Análise e armazenamento dos dados em servidor de alto desempenho exclusivo para o projeto. ",
    },
    {
      text: "Amostras preservadas pela Coleção de Culturas de Bactérias de Origem Hospitalar (WDCM 947)",
    },
    {
      text: "Visualização interativa para toda comunidade dos dados gerados pelos integrantes da rede.",
      button: { btn_name: "Dashboard", btn_link: "/dashboard" },
    },
    {
      text: "Geração de informações relevantes para guiar estratégias de prevenção e controle de bactérias multirresistente.",
      button: { btn_name: "CABGen", btn_link: "/about" },
    },
  ];

  return (
    <Section id="network-purposes">
      <div className={section_spacing}>
        <h2 className="text-center mb-3 md:text-3xl text-2xl">Contribuições</h2>
        <div className="grid grid-row sm:grid-cols-3 grid-cols-2 sm:gap-3 gap-2 xl:text-xl sm:text-lg text-sm font-light">
          {data.map(({ text, button }, idx) => (
            <Card
              className="flex flex-col justify-center items-center p-2 m-0 hover:scale-110 hover:font-normal hover:border-cabgen-700 delay-50 ease-in-out transition cursor-default"
              key={idx}
            >
              <CardContent className="p-2 m-0">{text}</CardContent>
              {button && (
                <CardFooter className="m-0 p-0">
                  <Link href={button.btn_link}>
                    <button className="bg-cabgen-300 hover:bg-cabgen-500 rounded-lg py-2 px-3 sm:text-base text-sm text-white">
                      {button.btn_name}
                    </button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default NetworkPurposes;
