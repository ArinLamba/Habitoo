"use client";

import * as React from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartKey = "day" | "week" | "month" | "year";

type ChartPoint = {
  label: string;
  value: number;
  target?: number;
};

type Props = {
  color: string;
  charts: Record<ChartKey, ChartPoint[]>;
};

const chartMeta: Record<ChartKey, { label: string }> = {
  day: { label: "Day" },
  week: { label: "Week" },
  month: { label: "Month" },
  year: { label: "Year" },
};

export function AnalyticsChart({ color, charts }: Props) {
  const [activeChart, setActiveChart] =
    React.useState<ChartKey>("week");

  const data = charts?.[activeChart] ?? [];

  return (
    <Card className="p-0">
      {/* HEADER */}
      <CardHeader className="flex  items-stretch p-0 flex-row">
        <div className="flex flex-1 flex-col justify-center gap- px-6 pt-4 pb-0">
          <CardTitle>Habit Consistency</CardTitle>
          <CardDescription>
            Track your progress across time ranges
          </CardDescription>
        </div>

        {/* TOGGLE */}
        <div className="flex">
          {(Object.keys(chartMeta) as ChartKey[]).map((key) => {
            const isActive = activeChart === key;

            return (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                data-active={isActive}
                className="
                  flex flex-1 flex-col justify-center gap-1 
                  border-t px-2 text-left border-l
                  data-[active=true]:bg-muted/50
                "
              >
                <span className="text-xs text-muted-foreground">
                  {chartMeta[key].label}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* CHART */}
      <CardContent className="px-2 p-3">
        <ChartContainer
          config={{
            value: { label: "Progress" },
            target: { label: "Target" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={28}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="value"
              fill={color}
              radius={6}
            >
              {data.map((point, index) => (
                <Cell
                  key={`${point.label}-${index}`}
                  fill={
                    point.target !== undefined &&
                    point.value > point.target
                      ? "#f59e0b"
                      : color
                  }
                />
              ))}
            </Bar>
            <Line
              dataKey="target"
              type="monotone"
              stroke="#a1a1aa"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
