import { HABIT_STATUS, type Completion, type Habit } from "@habitoo/core";
import { useMemo } from "react";
import { Text, View } from "react-native";

type HabitSignalsProps = {
  habits: Habit[];
  completions: Completion[];
};

export function HabitSignals({ habits, completions }: HabitSignalsProps) {
  const { best, worst } = useMemo(() => {
    const map = new Map<string, number>();
    habits.forEach((habit) => map.set(habit.id, 0));

    completions.forEach((completion) => {
      if (completion.status !== HABIT_STATUS.COMPLETED) return;
      map.set(completion.habitId, (map.get(completion.habitId) || 0) + 1);
    });

    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);

    return {
      best: habits.find((habit) => habit.id === sorted[0]?.[0]),
      worst: habits.find((habit) => habit.id === sorted[sorted.length - 1]?.[0]),
    };
  }, [habits, completions]);

  return (
    <View className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
      <Text className="text-xs font-extrabold uppercase text-zinc-500">
        Habit signals
      </Text>
      <View className="mt-4 gap-3">
        <View className="rounded-md bg-emerald-500/10 p-3">
          <Text className="text-xs font-semibold text-zinc-500">Most logged</Text>
          <Text className="mt-1 text-base font-extrabold text-white">
            {best?.name || "-"}
          </Text>
        </View>
        <View className="rounded-md bg-amber-500/10 p-3">
          <Text className="text-xs font-semibold text-zinc-500">Needs a nudge</Text>
          <Text className="mt-1 text-base font-extrabold text-white">
            {worst?.name || "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}
