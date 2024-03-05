import React from "react";
import CabgenMission from "@/components/About/CabgenMission";
import CabgenPipeline from "@/components/About/CabgenPipeline";
import CabgenResults from "@/components/About/CabgenResults";

const About = () => {
  return (
    <>
      <CabgenMission />
      <CabgenPipeline/>
      <CabgenResults/>
    </>
  );
};

export default About;
