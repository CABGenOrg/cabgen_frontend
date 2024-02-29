import React from "react";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import Image from "next/image";

const Financiers = () => {
  const logos = [
    {
      name: "Ministério da Saúde logo",
      logo: "/Home/min_saude.png",
      size: "sm:h-1/2 sm:w-1/2 h-3/4 w-3/4",
    },
    {
      name: "CNPQ logo",
      logo: "/Home/cnpq.png",
      size: "sm:h-1/4 sm:w-1/4 h-1/2 w-1/2",
    },
    {
      name: "CDC logo",
      logo: "/Home/cdc.png",
      size: "sm:h-1/5 sm:w-1/5 h-1/3 w-1/3",
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
            <Image
              key={idx}
              src={logo}
              alt={name}
              width={5000}
              height={5000}
              className={size}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Financiers;
