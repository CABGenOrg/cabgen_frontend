import React from "react";
import OptimizedImage from "../General/OptimizedImage";
import Section from "../General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";

const NetworkMap = () => {
  return (
    <Section id="network-map">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h2 className={`${section_title} text-center mb-7 mt-4`}>
          Integrantes Atuais
        </h2>
        <OptimizedImage
          src="/Network/mapa_cabgen.png"
          alt="LACENs map"
          className="w-fit h-auto rounded-xl"
        />
      </div>
    </Section>
  );
};

export default NetworkMap;
