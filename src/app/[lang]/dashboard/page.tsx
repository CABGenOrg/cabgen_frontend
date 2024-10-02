import React from "react";
import Section from "@/components/General/Section";
import dynamic from "next/dynamic";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import Loading from "@/components/General/Loading";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { Locale } from "@/i18n/i18n.config";
import MicroreactWarning from "@/components/Dashboard/MicroreactWarning";

const microreactURL = process.env.MICROREACT_URL || "";

const Dashboard = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateServer(lang);

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
          {Dashboard.sectionTitle}
        </h1>
        <MicroreactWarning />
        <iframe
          src={microreactURL}
          width="100%"
          height="100%"
          className="w-[95vw] h-[180vh] border-none p-0 m-0"
          title="Genomic Network Data on Microreact"
          loading="lazy"
          allowFullScreen
        ></iframe>
        {/* <Map /> */}
      </div>
    </Section>
  );
};

export default Dashboard;
