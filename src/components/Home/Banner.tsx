import React from "react";
import Section from "../General/Section";
import { section_spacing } from "@/styles/tailwind_classes";

const Banner = () => {
  return (
    <Section id="home-banner">
      <div className="bg-[url('/Home/source.png')] bg-center bg-cover w-screen xl:h-96 md:h-80 h-52">
        <div className="h-full flex items-center">
          <h1
            className={`font-bold lg:text-6xl md:text-5xl sm:text-3xl text-2xl ${section_spacing} bg-white/50 p-2 rounded-lg`}
          >
            CABGen: Clinical Applied <br /> Bacterial Genomics
          </h1>
        </div>
      </div>
    </Section>
  );
};

export default Banner;
