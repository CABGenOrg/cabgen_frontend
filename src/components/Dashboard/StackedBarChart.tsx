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
  Legend,
} from "recharts";
import { map_graph_title } from "@/styles/tailwind_classes";
import { getRoundedMax, getColorForSpecies } from "@/utils/handleGraph";

type BarChartData = Record<string, any>;

interface StackedBarChartProps {
  title: string;
  data: BarChartData[];
  xDataKey: string;
  yLabel?: string;
  xLabel?: string;
  xLabelOffset?: number;
  xTick?: boolean;
  keys: string[];
  showLegend?: boolean;
  rotateTicks?: boolean;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  title,
  data,
  xDataKey,
  yLabel,
  xLabel,
  xLabelOffset = 0,
  xTick = true,
  keys,
  showLegend = false,
  rotateTicks = false,
}) => {
  const maxValue = useMemo(() => {
    return Math.max(
      ...data.map((item) =>
        keys.reduce((sum, key) => sum + (item[key] || 0), 0)
      )
    );
  }, [data, keys]);
  console.log(data);
  // Base dimensions for short charts
  const baseHeight = 400;
  // Size per item
  const sizePerItem = 15;
  // Total height adapts to amount of data
  const chartHeight = Math.max(baseHeight, data.length * sizePerItem);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className={map_graph_title}>{title}</h2>
      <div className="mx-auto w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw]">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: rotateTicks ? 250 : 50,
            }}
          >
            <CartesianGrid horizontal vertical={false} />
            <XAxis
              dataKey={xDataKey}
              angle={rotateTicks ? -90 : 0}
              textAnchor={rotateTicks ? "end" : "middle"}
              interval={0}
              tick={xTick ? { fontSize: 12 } : xTick}
            >
              {xLabel && (
                <Label
                  value={xLabel}
                  offset={rotateTicks && xTick ? 135 : showLegend ? 35 : 0}
                  position="bottom"
                />
              )}
            </XAxis>
            <YAxis
              domain={[0, getRoundedMax(maxValue)]}
              allowDataOverflow={true}
            >
              {yLabel && (
                <Label
                  value={yLabel}
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              )}
            </YAxis>
            <Tooltip />
            {showLegend && <Legend />}
            {keys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={getColorForSpecies(key)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;
