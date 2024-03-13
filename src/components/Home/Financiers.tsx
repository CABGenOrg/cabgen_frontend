import React from "react";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";

const Financiers = () => {
  const logos = [
    {
      name: "Ministério da Saúde logo",
      logo: "/Home/min_saude.png",
      size: "sm:h-1/3 sm:w-1/3 h-2/4 w-2/4",
    },
    {
      name: "CNPQ logo",
      logo: "/Home/cnpq.png",
      size: "sm:h-1/4 sm:w-1/4 h-1/2 w-1/2",
    },
    {
      name: "Fiocruz logo",
      logo: "/Home/fiocruz.png",
      size: "sm:h-auto sm:w-1/12 h-auto w-2/12",
    },
  ];

  return (
    <Section id="financiers" gray>
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h2 className={section_title}>Financiadores</h2>
        <div className="flex sm:flex-row flex-col justify-center items-center sm:gap-5 gap-3 sm:m-3 m-1.5">
          {logos.map(({ name, logo, size }, idx) => (
            <OptimizedImage
              key={idx}
              src={logo}
              alt={name}
              className={size}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Financiers;
