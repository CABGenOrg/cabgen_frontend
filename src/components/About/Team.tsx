import React from "react";
import Section from "../General/Section";
import TeamCard from "./TeamCard";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const Team = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { About },
  } = getTranslateServer(lang);

  const members = [
    {
      name: "Ana Paula D'Alincourt Carvalho Assef",
      role: About.Team.roleAnaPaula,
      photo: "/About/ana.png",
      link: "https://lattes.cnpq.br/5196425284967145",
    },
    {
      name: "Fabrício Alves Barbosa da Silva",
      role: About.Team.roleFabricio,
      photo: "/About/fabricio.png",
      link: "https://lattes.cnpq.br/6679069461879682",
    },
    {
      name: "Felicita Mabel Duré Pérez",
      role: About.Team.roleFelicita,
      photo: "/About/felicita.png",
      link: "https://lattes.cnpq.br/2409366351567830",
    },
    {
      name: "Melise Chaves Silveira",
      role: About.Team.roleMelise,
      photo: "/About/melise.png",
      link: "https://lattes.cnpq.br/1087065098750707",
    },
    {
      name: "Rodolpho Mattos Albano",
      role: About.Team.roleRodolpho,
      photo: "/About/rodolpho.png",
      link: "https://lattes.cnpq.br/1268859650338952",
    },
    {
      name: "Cláudio Marcos Rocha de Souza",
      role: About.Team.roleClaudio,
      photo: "/About/claudio.png",
      link: "https://lattes.cnpq.br/7903354651687538",
    },
    {
      name: "Nicolas da Matta Freire Araujo",
      role: About.Team.roleNicolas,
      photo: "/About/nicolas.png",
      link: "https://www.linkedin.com/in/nicolas-da-matta/",
    },
  ];
  return (
    <Section id="cabgen team">
      <div className={section_spacing}>
        <h2
          className={`${section_title} text-center 2xl:mb-7 mb-4 2xl:mt-4 mt-1`}
        ></h2>
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
