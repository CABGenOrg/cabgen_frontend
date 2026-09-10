"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type ChartDatum = { name: string; value: number; fill: string };

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
    <div className="h-[300px] md:h-[350px]">{children}</div>
  </div>
);

const AdminOverviewCharts = ({
  statusData,
  countryData,
  speciesData,
  titles,
}: {
  statusData: ChartDatum[];
  countryData: ChartDatum[];
  speciesData: ChartDatum[];
  titles: {
    analysesByStatus: string;
    topCountries: string;
    speciesBreakdown: string;
    count: string;
  };
}) => (
  <div className="grid lg:grid-cols-2 gap-6 mb-6">
    <ChartCard title={titles.analysesByStatus}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {statusData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [value, name]} />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.topCountries}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={countryData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f3f4f6" }} formatter={(val: number) => [val, titles.count]} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {countryData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.speciesBreakdown}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={speciesData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f3f4f6" }} formatter={(val: number) => [val, titles.count]} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {speciesData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

export default AdminOverviewCharts;
