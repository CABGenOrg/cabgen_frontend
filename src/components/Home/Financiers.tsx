import React from "react";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";

const Financiers = () => {
  const logos = [
    {
      name: "Ministério da Saúde logo",
      logo: "/Home/min_saude.png",
      size: "2xl:h-[35%] 2xl:w-[35%]  h-[80%] w-[80%]",
    },
    {
      name: "CNPQ logo",
      logo: "/Home/cnpq.png",
      size: "2xl:h-[25%] 2xl:w-[25%] h-[35%] w-[35%]",
    },
    {
      name: "Fiocruz logo",
      logo: "/Home/fiocruz.png",
      size: "2xl:h-[10%] 2xl:w-[10%] h-[20%] w-[20%]",
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
            <OptimizedImage key={idx} src={logo} alt={name} className={size} />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Financiers;
