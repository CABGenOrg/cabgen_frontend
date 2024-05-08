import React from "react";
import Section from "@/components/General/Section";
import dynamic from "next/dynamic";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import Loading from "@/components/General/Loading";

const Dashboard = () => {
  const Map = dynamic(() => import("@/components/Dashboard/Map"), {
    ssr: false,
    loading: () => <Loading />,
  });
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
