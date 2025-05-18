"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
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

type LineChartData = Record<string, any>;

interface MultiLineChartProps {
  title: string;
  data: LineChartData[];
  xDataKey: string;
  yLabel?: string;
  xLabel?: string;
  xLabelOffset?: number;
  xTick?: boolean;
  keys: string[];
  showLegend?: boolean;
  rotateTicks?: boolean;
}

const MultiLineChart: React.FC<MultiLineChartProps> = ({
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
      ...data.flatMap((item) => keys.map((key) => item[key] || 0))
    );
  }, [data, keys]);

  const baseHeight = 300;
  const chartHeight = Math.max(baseHeight, data.length * 15);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className={map_graph_title}>{title}</h2>
      <div className="mx-auto w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw]">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 25,
              left: 25,
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
                  offset={
                    rotateTicks && xTick ? 135 : showLegend ? xLabelOffset : 0
                  }
                  position="bottom"
                />
              )}
            </XAxis>
            <YAxis domain={[0, getRoundedMax(maxValue)]}>
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
              <Line
                key={key}
                dataKey={key}
                stroke={getColorForSpecies(key)}
                type="monotone"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiLineChart;
