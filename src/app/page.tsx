import React from "react";
import Banner from "@/components/Home/Banner";
import CabgenDescription from "@/components/Home/CabgenDescription";
import Statistics from "@/components/Home/Statistics";
import GenomicSurveillance from "@/components/Home/GenomicSurveillance";

const Home = () => {
  return (
    <>
      <Banner />
      <CabgenDescription/>
      <Statistics/>
      <GenomicSurveillance/>
    </>
  );
};

export default Home;
