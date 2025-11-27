import React from "react";
import Section from "@/components/General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
// import InternalDashboard from "@/components/Dashboard/InternalDashboard";
import MicroreactDashboard from "@/components/Dashboard/MicroreactDashboard";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { Locale } from "@/i18n/i18n.config";

const Dashboard = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateServer(lang);

  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className={`${section_title} text-center mt-4 mb-7`}>
          {Dashboard.sectionTitle}
        </h1>
        <MicroreactDashboard />
        {/* <InternalDashboard lang={lang} /> */}
      </div>
    </Section>
  );
};

export default Dashboard;
