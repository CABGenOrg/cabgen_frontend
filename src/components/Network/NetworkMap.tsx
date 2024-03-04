import React from "react";
import Image from "next/image";
import Section from "../General/Section";
import { section_spacing } from "@/styles/tailwind_classes";

const NetworkMap = () => {
  return (
    <Section id="network-map" gray>
      <div className={`flex justify-center items-center ${section_spacing}`}>
        <Image
          src="/Network/lacens_map.png"
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
