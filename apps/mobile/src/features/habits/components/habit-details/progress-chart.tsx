import type { HabitFrequency } from "@habitoo/core";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { HabitAnalytics } from "./types";

type ChartKey = "day" | "week" | "month" | "year";

type ProgressChartProps = {
  analytics: HabitAnalytics;
  color: string;
  frequency: HabitFrequency;
};

const chartTabs: Array<{ key: ChartKey; label: string }> = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
];

export function ProgressChart({ analytics, color, frequency }: ProgressChartProps) {
  const [activeChart, setActiveChart] = useState<ChartKey>(
    frequency === "day" ? "week" : frequency
  );
  const data = analytics.charts[activeChart] ?? [];
  const visibleData = data.slice(-12);
  const maxValue = useMemo(
    () =>
      Math.max(
        1,
        ...visibleData.map((item) => Math.max(item.value, item.target ?? 0))
      ),
    [visibleData]
  );

  return (
    <View className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-base font-extrabold text-white">
            Habit consistency
          </Text>
          <Text className="mt-1 text-sm font-semibold text-zinc-500">
            Progress across time ranges
          </Text>
        </View>
        <View className="flex-row rounded-full bg-zinc-950 p-1">
          {chartTabs.map((tab) => {
            const selected = tab.key === activeChart;

            return (
              <Pressable
                accessibilityRole="button"
                className={`rounded-full px-3 py-1.5 ${
                  selected ? "bg-zinc-800" : ""
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

      <View className="h-44 flex-row items-end gap-2">
        {visibleData.map((point, index) => {
          const height = Math.max(6, Math.round((point.value / maxValue) * 160));
          const targetHeight = point.target
            ? Math.max(6, Math.round((point.target / maxValue) * 160))
            : 0;

          return (
            <View className="flex-1 items-center justify-end" key={`${point.label}-${index}`}>
              <View className="h-40 w-full justify-end">
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
