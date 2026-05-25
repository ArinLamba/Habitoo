import type { HabitFrequency } from "@habitoo/core";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { HeatmapRange } from "./habit-details-range-select";
import type { HabitAnalytics } from "./types";

type ChartKey = "day" | "week" | "month" | "year";

type ProgressChartProps = {
  analytics: HabitAnalytics;
  color: string;
  frequency: HabitFrequency;
  range: HeatmapRange;
};

const chartTabs: Array<{ key: ChartKey; label: string }> = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

const getVisibleCount = (range: HeatmapRange, activeChart: ChartKey) => {
  if (range === "all") return undefined;

  const days = Number(range);

  if (activeChart === "day") return days;
  if (activeChart === "week") return Math.max(1, Math.ceil(days / 7));
  if (activeChart === "month") return Math.max(1, Math.ceil(days / 30));

  return Math.max(1, Math.ceil(days / 365));
};

export function ProgressChart({
  analytics,
  color,
  frequency,
  range,
}: ProgressChartProps) {
  const [activeChart, setActiveChart] = useState<ChartKey>(
    frequency === "day" ? "week" : frequency
  );
  const data = analytics.charts[activeChart] ?? [];
  const visibleCount = getVisibleCount(range, activeChart);
  const visibleData = visibleCount ? data.slice(-visibleCount) : data;
  const maxValue = useMemo(
    () =>
      Math.max(
        1,
        ...visibleData.map((item) => Math.max(item.value, item.target ?? 0))
      ),
    [visibleData]
  );

  return (
    <View className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-0">
      <View className="flex-row items-stretch border-b border-zinc-800">
        <View className="min-w-0 flex-1 justify-center px-5 py-4">
          <Text className="text-base font-extrabold text-white">
            Habit consistency
          </Text>
          <Text className="mt-1 text-sm font-semibold text-zinc-500">
            Progress across time ranges
          </Text>
        </View>
        <View className="w-[138px] flex-row flex-wrap border-l border-zinc-800">
          {chartTabs.map((tab) => {
            const selected = tab.key === activeChart;

            return (
              <Pressable
                accessibilityRole="button"
                className={`h-12 w-1/2 items-center justify-center border-b border-zinc-800 ${
                  selected ? "bg-zinc-800/80" : ""
                }`}
                key={tab.key}
                onPress={() => setActiveChart(tab.key)}
              >
                <Text
                  className={`text-xs font-extrabold ${
                    selected ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="h-[250px] flex-row items-end gap-2 px-4 pb-4 pt-5">
        {visibleData.map((point, index) => {
          const height = Math.max(6, Math.round((point.value / maxValue) * 205));
          const targetHeight = point.target
            ? Math.max(6, Math.round((point.target / maxValue) * 205))
            : 0;

          return (
            <View className="flex-1 items-center justify-end" key={`${point.label}-${index}`}>
              <View className="h-[205px] w-full justify-end">
                {targetHeight ? (
                  <View
                    className="absolute left-0 right-0 border-t border-dashed border-zinc-500"
                    style={{ bottom: targetHeight }}
                  />
                ) : null}
                <View
                  className="w-full rounded-t-lg"
                  style={{
                    backgroundColor:
                      point.target !== undefined && point.value > point.target
                        ? "#f59e0b"
                        : color,
                    height,
                    opacity: point.value === 0 ? 0.22 : 0.9,
                  }}
                />
              </View>
              <Text className="mt-2 text-[10px] font-bold text-zinc-500" numberOfLines={1}>
                {point.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
