"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { DashboardDataProps } from "@/types/dashboard";
import { getRoundedMax, getColorForSpecies } from "@/utils/handleGraph";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { map_graph_title } from "@/styles/tailwind_classes";

const DashboardBarChart: React.FC<DashboardDataProps> = ({ lang, data }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateClient(lang);
  const groupedData: Record<string, Record<string, number>> = {};

  // Groups the data by carbapenemase and counts occurrences per species
  data.forEach(({ carbapenemase, species }) => {
    if (!groupedData[carbapenemase]) {
      groupedData[carbapenemase] = {};
    }
    if (!groupedData[carbapenemase][species]) {
      groupedData[carbapenemase][species] = 0;
    }
    groupedData[carbapenemase][species] += 1;
  });

  // Extracts all unique species names from the dataset
  const allSpecies = Array.from(new Set(data.map((item) => item.species)));

  // Transforms grouped data into a flat array of objects for the chart
  const chartData = Object.entries(groupedData)
    .map(([carbapenemase, speciesCounts]) => {
      const entry: Record<string, any> = { carbapenemase };
      let total = 0;

      // Sums up counts for each species and computes a total for sorting
      allSpecies.forEach((species) => {
        const count = speciesCounts[species] || 0;
        entry[species] = count;
        total += count;
      });

      entry.total = total;
      return entry;
    })
    .sort((a, b) => b.total - a.total);

  // Base dimensions for short charts
  const baseHeight = 300;
  // Size per item
  const sizePerItem = 15;
  // Total height adapts to amount of data
  const chartHeight = Math.max(baseHeight, chartData.length * sizePerItem);

  // Calculates the maximum total count among all carbapenemases
  const maxValue = useMemo(() => {
    return Math.max(
      ...chartData.map((item) =>
        allSpecies.reduce((sum, species) => sum + (item[species] || 0), 0)
      )
    );
  }, [chartData, allSpecies]);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className={map_graph_title}>{Dashboard.barChart.title}</h2>
      <div className="mx-auto w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw]">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 250 }}
          >
            <CartesianGrid horizontal vertical={false} />
            <XAxis
              dataKey="carbapenemase"
              angle={-90}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
            >
              <Label
                value={Dashboard.barChart.xlabel}
                offset={135}
                position="bottom"
              />
            </XAxis>
            <YAxis
              domain={[0, getRoundedMax(maxValue)]}
              allowDataOverflow={true}
            >
              <Label
                value={Dashboard.barChart.ylabel}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip />
            {allSpecies.map((species, index) => (
              <Bar
                key={species}
                dataKey={species}
                stackId="a"
                fill={getColorForSpecies(species)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardBarChart;
