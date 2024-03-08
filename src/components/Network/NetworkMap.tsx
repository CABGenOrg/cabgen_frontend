import React from "react";
import Image from "next/image";
import Section from "../General/Section";
import { section_spacing, section_subtitle } from "@/styles/tailwind_classes";

const NetworkMap = () => {
  return (
    <Section id="network-map" gray>
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h2 className={`${section_subtitle} my-2`}>Integrantes Atuais</h2>
        <Image
          src="/Network/mapa_cabgen.png"
          alt="LACENs map"
          width={5000}
          height={5000}
          className="w-fit h-auto rounded-xl"
        />
      </div>
    </Section>
  );
};

export default NetworkMap;
