import React from "react";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const Financiers = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  const logos = [
    {
      name: "Ministério da Saúde logo",
      logo: "/Home/min_saude.png",
      size: "md:w-[40%] w-[65%]",
    },
    {
      name: "CNPQ logo",
      logo: "/Home/cnpq.png",
      size: "md:w-[30%] w-[65%]",
    },
    {
      name: "Fiocruz logo",
      logo: "/Home/fiocruz.png",
      size: "md:w-[30%] w-[65%]",
    },
    {
      name: "Inova Fiocruz logo",
      logo: "/Home/inova_fiocruz.png",
      size: "md:w-[30%] w-[65%]",
    },
  ];

  return (
    <Section id="financiers" gray>
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h2 className={`${section_title} pb-3`}>
          {Home.Financiers.sectionTitle}
        </h2>
        <div className="flex flex-wrap justify-evenly items-center md:gap-3 gap-10">
          {logos.map(({ name, logo, size }, idx) => (
            <OptimizedImage key={idx} src={logo} alt={name} className={size} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Financiers;
