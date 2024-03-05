import React from "react";
import CabgenMission from "@/components/About/CabgenMission";
import CabgenPipeline from "@/components/About/CabgenPipeline";
import CabgenResults from "@/components/About/CabgenResults";
import Team from "@/components/About/Team";

const About = () => {
  return (
    <>
      <CabgenMission />
      <CabgenPipeline/>
      <CabgenResults/>
      <Team/>
    </>
  );
};

export default About;
