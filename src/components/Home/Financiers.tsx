import React from "react";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";

const Financiers = () => {
  const logos = [
    {
      name: "Ministério da Saúde logo",
      logo: "/Home/min_saude.png",
      size: "w-3/4",
    },
    {
      name: "CNPQ logo",
      logo: "/Home/cnpq.png",
      size: "w-2/5",
    },
    {
      name: "Fiocruz logo",
      logo: "/Home/fiocruz.png",
      size: "w-1/5",
    },
  ];

  return (
    <Section id="financiers" gray>
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h2 className={section_title}>Financiadores</h2>
        <div className="flex md:flex-row flex-col justify-center items-center md:gap-3 gap-2 md:m-3 m-1.5">
          {logos.map(({ name, logo, size }, idx) => (
            <OptimizedImage key={idx} src={logo} alt={name} className={size} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Financiers;
