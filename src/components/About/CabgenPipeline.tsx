import React from "react";
import Section from "../General/Section";
import {
  section_spacing,
  section_subtitle,
  section_title,
} from "@/styles/tailwind_classes";
import Image from "next/image";

const CabgenPipeline = () => {
  return (
    <Section id="cabgen-pipeline">
      <div className={section_spacing}>
        <h2 className="text-center mb-3 md:text-3xl text-2xl">
          <span className={`${section_subtitle} uppercase`}>
            Por dentro do{" "}
          </span>
          <span className={section_title}>CABGen</span>
        </h2>
        <Image
          src="/About/cabgen_pipeline.png"
          alt="cabgen pipeline"
          width={5000}
          height={5000}
          className="w-auto h-auto"
        />
      </div>
    </Section>
  );
};

export default CabgenPipeline;
