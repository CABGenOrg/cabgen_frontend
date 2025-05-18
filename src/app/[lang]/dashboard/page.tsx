import React from "react";
import Section from "@/components/General/Section";
import dynamic from "next/dynamic";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import Loading from "@/components/General/Loading";
import { getTranslateServer } from "@/lib/getTranslateServer";
import { Locale } from "@/i18n/i18n.config";
import jsonData from "../../../../data/dashboard.json";
import { JSONData } from "@/types/dashboard";
import {
  groupAndCountCategories,
  groupAndCountPresence,
} from "@/utils/handleGraph";

const Dashboard = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateServer(lang);
  const dashboardData: JSONData = jsonData;

  const Map = dynamic(() => import("@/components/Dashboard/Map"), {
    ssr: false,
    loading: () => <Loading />,
  });
  const StackedBarChart = dynamic(
    () => import("@/components/Dashboard/StackedBarChart"),
    {
      ssr: false,
      loading: () => <Loading />,
    }
  );

  // Carbapenemases species keys
  const speciesKeys = Array.from(
    new Set(dashboardData.data.map((d) => d.species))
  );
  // Resistance keys
  const resistanceKeys = [
    "carbapenemase",
    "aminoglycosides",
    "quinolones",
    "sulfonamides",
    "polymyxin",
  ];

  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className={`${section_title} text-center mt-4`}>
          {Dashboard.sectionTitle}
        </h1>
        <h4 className="text-gray-400 text-center md:text-base text-xs mb-7 mt-2 text-opacity-30">
          {Dashboard.lastUpdateWarning} {dashboardData.last_update}
        </h4>
        <Map data={dashboardData.data} lang={lang} />
        {/* Resistance graph */}
        <StackedBarChart
          data={groupAndCountPresence({
            data: dashboardData.data,
            groupByKey: "year",
            countKeys: resistanceKeys,
          })}
          title={Dashboard.resistanceBarChart.title}
          xDataKey="year"
          xLabel={Dashboard.resistanceBarChart.xlabel}
          yLabel={Dashboard.resistanceBarChart.ylabel}
          keys={resistanceKeys}
          rotateTicks={false}
          xTick={false}
        />
        {/* Carbapenemase graph */}
        <StackedBarChart
          data={groupAndCountCategories({
            data: dashboardData.data,
            groupByKey: "carbapenemase",
            countKeys: ["species"],
            sortByTotal: true,
            limit: 30,
          })}
          title={Dashboard.carbapenemaseBarChart.title}
          xDataKey="carbapenemase"
          xLabel={Dashboard.carbapenemaseBarChart.xlabel}
          yLabel={Dashboard.carbapenemaseBarChart.ylabel}
          keys={speciesKeys}
          showLegend={false}
          rotateTicks={false}
          xTick={false}
        />
        {/* Aminoglycosides graph */}
        <StackedBarChart
          data={groupAndCountCategories({
            data: dashboardData.data,
            groupByKey: "aminoglycosides",
            countKeys: ["species"],
            sortByTotal: true,
            limit: 30,
          })}
          title={Dashboard.aminoglycosidesBarChart.title}
          xDataKey="aminoglycosides"
          xLabel={Dashboard.aminoglycosidesBarChart.xlabel}
          yLabel={Dashboard.aminoglycosidesBarChart.ylabel}
          keys={speciesKeys}
          showLegend={false}
          rotateTicks={false}
          xTick={false}
        />
        {/* Quinolones graph */}
        <StackedBarChart
          data={groupAndCountCategories({
            data: dashboardData.data,
            groupByKey: "quinolones",
            countKeys: ["species"],
            sortByTotal: true,
            limit: 30,
          })}
          title={Dashboard.quinolonesBarChart.title}
          xDataKey="quinolones"
          xLabel={Dashboard.quinolonesBarChart.xlabel}
          yLabel={Dashboard.quinolonesBarChart.ylabel}
          keys={speciesKeys}
          showLegend={false}
          rotateTicks={false}
          xTick={false}
        />
        {/* Sulfonamides graph */}
        <StackedBarChart
          data={groupAndCountCategories({
            data: dashboardData.data,
            groupByKey: "sulfonamides",
            countKeys: ["species"],
            sortByTotal: true,
            limit: 30,
          })}
          title={Dashboard.sulfonamidesBarChart.title}
          xDataKey="sulfonamides"
          xLabel={Dashboard.sulfonamidesBarChart.xlabel}
          yLabel={Dashboard.sulfonamidesBarChart.ylabel}
          keys={speciesKeys}
          showLegend={false}
          rotateTicks={false}
          xTick={false}
        />
        {/* Polymyxin graph */}
        <StackedBarChart
          data={groupAndCountCategories({
            data: dashboardData.data,
            groupByKey: "polymyxin",
            countKeys: ["species"],
            sortByTotal: true,
            limit: 30,
          })}
          title={Dashboard.polymyxinBarChart.title}
          xDataKey="polymyxin"
          xLabel={Dashboard.polymyxinBarChart.xlabel}
          yLabel={Dashboard.polymyxinBarChart.ylabel}
          keys={speciesKeys}
          showLegend={false}
          rotateTicks={false}
          xTick={false}
        />
      </div>
    </Section>
  );
};

export default Dashboard;
