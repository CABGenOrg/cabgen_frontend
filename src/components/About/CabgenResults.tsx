import React from "react";
import Section from "../General/Section";
import {
  section_spacing,
  section_subtitle,
  section_title,
} from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";

const CabgenResults = () => {
  return (
    <Section id="cabgen-pipeline" gray>
      <div className={section_spacing}>
        <h2 className="text-center mb-3 md:text-3xl text-2xl">
          <span className={`${section_subtitle} uppercase`}>
            Resultados do{" "}
          </span>
          <span className={section_title}>CABGen</span>
        </h2>
        <OptimizedImage
          src="/About/cabgen_result.png"
          alt="cabgen result example"
          className="w-auto h-auto"
        />
      </div>
    </Section>
  );
};

export default CabgenResults;
