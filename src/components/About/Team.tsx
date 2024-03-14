import React from "react";
import Section from "../General/Section";
import TeamCard from "./TeamCard";
import { section_spacing, section_title } from "@/styles/tailwind_classes";

const Team = () => {
  const members = [
    {
      name: "Ana Paula D'Alincourt Carvalho Assef",
      role: "Responsável por coordenar o projeto, analisar os resultados fenotípicos, moleculares e de sequenciamento e enviar os resultados para o sistema Gerenciamento de Ambiente de Laboratório (GAL).",
      photo: "/About/ana.png",
      link: "https://lattes.cnpq.br/5196425284967145",
    },
    {
      name: "Fabrício Alves Barbosa da Silva",
      role: "Responsável por gerenciar a utilização do servidor da Fiocruz para montagem de genomas e desenvolvimento do banco de dados para disponibilização de genomas.",
      photo: "/About/fabricio.png",
      link: "https://lattes.cnpq.br/6679069461879682",
    },
    {
      name: "Felicita Mabel Duré Pérez",
      role: "Doutoranda do Programa de Biologia Computacional e Sistemas do Doutorado em Ciências da Saúde Cooperação internacional entre a Fundação Oswaldo Cruz e o Focem-Mercosul - Paraguai.",
      photo: "/About/felicita.png",
      link: "https://lattes.cnpq.br/2409366351567830",
    },
    {
      name: "Melise Chaves Silveira",
      role: "Responsável pela análise dos resultados obtidos no sequenciamento de todo o genoma.",
      photo: "/About/melise.png",
      link: "https://lattes.cnpq.br/1087065098750707",
    },
    {
      name: "Rodolpho Mattos Albano",
      role: "Pesquisador da UERJ.",
      photo: "/About/rodolpho.png",
      link: "https://lattes.cnpq.br/1268859650338952",
    },
    {
      name: "Cláudio Marcos Rocha de Souza",
      role: "Responsável pelo gerenciamento das atividades laboratoriais do LAPIH e liofilização e armazenamento de amostras bacterianas.",
      photo: "/About/claudio.png",
      link: "https://lattes.cnpq.br/7903354651687538",
    },
    {
      name: "Nicolas da Matta Freire Araujo",
      role: "Responsável pelo desenvolvimento da nova versão do front-end do CABGen.",
      photo: "/About/nicolas.png",
      link: "https://www.linkedin.com/in/nicolas-da-matta/",
    },
  ];
  return (
    <Section id="cabgen team">
      <div className={section_spacing}>
        <h2
          className={`${section_title} text-center 2xl:mb-7 mb-4 2xl:mt-4 mt-1`}
        >
          Conheça nossos profissionais
        </h2>
        <div className="grid md:grid-cols-2 grid-cols-1 sm:gap-2 gap-1">
          {members.map(({ name, role, photo, link }, idx) => (
            <TeamCard
              key={idx}
              name={name}
              role={role}
              photo={photo}
              link={link}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Team;
