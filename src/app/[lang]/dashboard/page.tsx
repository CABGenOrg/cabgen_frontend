import React from "react";
import Section from "@/components/General/Section";
import dynamic from "next/dynamic";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import Loading from "@/components/General/Loading";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { Locale } from "@/i18n/i18n.config";
import jsonData from "../../../../data/dashboard.json";
import { JSONData } from "@/types/dashboard";

const Dashboard = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateServer(lang);

  const Map = dynamic(() => import("@/components/Dashboard/Map"), {
    ssr: false,
    loading: () => <Loading />,
  });

  const dashboardData: JSONData = jsonData;
  const DashboardBarChart = dynamic(
    () => import("@/components/Dashboard/DashboardBarChart"),
    {
      ssr: false,
      loading: () => <Loading />,
    }
  );

  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className={`${section_title} text-center mt-4`}>
          {Dashboard.sectionTitle}
        </h1>
        <h4 className="text-gray-400 text-center md:text-base text-xs mb-7 mt-2 text-opacity-30">
          Última atualização em {dashboardData.last_update}
        </h4>
        <Map data={dashboardData.data} lang={lang} />
        <DashboardBarChart data={dashboardData.data} lang={lang} />
      </div>
    </Section>
  );
};

export default Dashboard;
