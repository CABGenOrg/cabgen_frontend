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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type ChartDatum = { name: string; value: number; fill: string };

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-card rounded-lg shadow-md border border-border p-5">
    <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
    <div className="h-[300px] md:h-[350px]">{children}</div>
  </div>
);

const OverviewCharts = ({
  statusData,
  typeData,
  speciesData,
  geneData,
  durationData,
  monthData,
  fmtMin,
  fmtDur,
  titles,
}: {
  statusData: ChartDatum[];
  typeData: ChartDatum[];
  speciesData: ChartDatum[];
  geneData: ChartDatum[];
  durationData: { name: string; avg: number; p95: number }[];
  monthData: { name: string; value: number }[];
  fmtMin: (v: number) => string;
  fmtDur: (v: number) => string;
  titles: {
    byStatus: string;
    byType: string;
    topSpecies: string;
    count: string;
    topResistanceGenes: string;
    duration: string;
    avgDuration: string;
    p95Duration: string;
    samplesByMonth: string;
  };
}) => (
  <div className="grid lg:grid-cols-2 gap-6 mb-6">
    <ChartCard title={titles.byStatus}>
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
          <Tooltip
            formatter={(value: number, name: string) => [value, name]}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.byType}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={typeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            paddingAngle={2}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {typeData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [value, name]}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.duration}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={durationData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tickFormatter={(v: number) => fmtMin(v)} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            formatter={(val: number, name: string) => [
              fmtDur(Number(val)),
              name === "avg" ? titles.avgDuration : titles.p95Duration,
            ]}
          />
          <Legend
            formatter={(value: string) =>
              value === "avg" ? titles.avgDuration : titles.p95Duration
            }
            iconType="circle"
          />
          <Bar dataKey="avg" name="avg" fill="#0A6354" radius={[4, 4, 0, 0]} />
          <Bar dataKey="p95" name="p95" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.samplesByMonth}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} width={40} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(val: number) => [val, titles.count]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0A6354"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title={titles.topSpecies}>
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

    <ChartCard title={titles.topResistanceGenes}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={geneData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f3f4f6" }} formatter={(val: number) => [val, titles.count]} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {geneData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

export default OverviewCharts;
