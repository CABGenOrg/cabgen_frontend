import React from "react";
import Banner from "@/components/Home/Banner";
import CabgenDescription from "@/components/Home/CabgenDescription";
import Statistics from "@/components/Home/Statistics";
import GenomicSurveillance from "@/components/Home/GenomicSurveillance";
import AntimicrobialResistance from "@/components/Home/AntimicrobialResistance";

const Home = () => {
  return (
    <>
      <Banner />
      <CabgenDescription />
      <Statistics />
      <GenomicSurveillance />
      <AntimicrobialResistance />
    </>
  );
};

export default Home;
