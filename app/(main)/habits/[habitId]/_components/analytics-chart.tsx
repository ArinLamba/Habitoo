"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
      <CardHeader className="flex flex-col items-stretch border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-0">
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
                  border-t px-2 text-left sm:border-l sm:border-t-0
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
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={{}}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="value"
              fill={color}
              radius={6}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}