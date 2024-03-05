import React from "react";
import Section from "../General/Section";
import TeamCard from "./TeamCard";
import { section_spacing } from "@/styles/tailwind_classes";

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
      name: "Robson de Souza Leão",
      role: "Responsável pelo gerenciamento das atividades laboratoriais, execução e interpretação de resultados fenotípicos e moleculares em Cocos Gram positivos.",
      photo: "/About/robson.png",
      link: "http://lattes.cnpq.br/5369029097197832",
    },
    {
      name: "Elizabeth de Andrade Marques",
      role: "Responsável pelo manejo das amostras de cocos Gram-positivos recebidas e análise final dos resultados.",
      photo: "/About/elizabeth.png",
      link: "https://lattes.cnpq.br/5959485578597640",
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
        <h2 className="text-center mb-3 md:text-3xl text-2xl font-bold">
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
