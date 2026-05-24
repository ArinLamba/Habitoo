import { getHabitPerformance, type Completion, type Habit } from "@habitoo/core";
import { TrendingUp } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";

type HabitPerformanceProps = {
  habits: Habit[];
  completions: Completion[];
};

export function HabitPerformance({ habits, completions }: HabitPerformanceProps) {
  const data = useMemo(() => {
    return getHabitPerformance(habits, completions)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8);
  }, [habits, completions]);

  return (
    <View className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
      <View className="flex-row items-center gap-2">
        <TrendingUp color="#34d399" size={18} strokeWidth={2.7} />
        <Text className="text-xs font-extrabold uppercase text-zinc-500">
          Habit health
        </Text>
      </View>
      <Text className="mt-1 text-lg font-extrabold text-white">
        Which habits are carrying the month
      </Text>

      <View className="mt-4 gap-4">
        {data.map((habit, index) => (
          <View key={`${habit.name}-${index}`}>
            <View className="mb-2 flex-row justify-between gap-3">
              <Text className="flex-1 font-bold text-white" numberOfLines={1}>
                {habit.name}
              </Text>
              <Text className="font-bold text-zinc-500">
                {habit.percentage}%
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <View
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${habit.percentage}%` }}
              />
            </View>
          </View>
        ))}

        {data.length === 0 ? (
          <Text className="text-sm font-semibold text-zinc-500">
            No habit data yet.
          </Text>
        ) : null}
      </View>
    </View>
  );
}
