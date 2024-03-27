import React from "react";
import CabgenMission from "@/components/About/CabgenMission";
import CabgenPipeline from "@/components/About/CabgenPipeline";
import CabgenResults from "@/components/About/CabgenResults";
import Team from "@/components/About/Team";
import AboutContact from "@/components/About/AboutContact";

const About = () => {
  return (
    <>
      <CabgenMission />
      <CabgenPipeline />
      <CabgenResults />
      <Team />
      <AboutContact />
    </>
  );
};

export default About;
