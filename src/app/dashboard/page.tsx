import React from "react";
import Section from "@/components/General/Section";
import Map from "@/components/Dashboard/Map";
import { section_spacing, section_title } from "@/styles/tailwind_classes";

const Dashboard = () => {
  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className={`${section_title} text-center mb-7 mt-4`}>
          Dados da Rede Genômica
        </h1>
        <Map />
      </div>
    </Section>
  );
};

export default Dashboard;
