import React from "react";
import Section from "@/components/General/Section";
import Map from "@/components/Dashboard/Map";
import { section_spacing } from "@/styles/tailwind_classes";

const Dashboard = () => {
  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className="text-center font-bold md:text-4xl sm:text-3xl text-2xl mb-3">
          Dados da Rede Genômica
        </h1>
        <Map />
      </div>
    </Section>
  );
};

export default Dashboard;
