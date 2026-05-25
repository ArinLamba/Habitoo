import type { Habit } from "@habitoo/core";
import { Text, View } from "react-native";

import { APP_ACCENT_COLOR } from "../../../shared/constants";

type HabitSummaryCardProps = {
  habit: Pick<Habit, "name" | "frequency" | "targetValue" | "unit" | "color">;
};

export function HabitSummaryCard({ habit }: HabitSummaryCardProps) {
  return (
    <View className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="flex-1 text-base font-bold text-white">
          {habit.name}
        </Text>
        <View
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: habit.color ?? APP_ACCENT_COLOR }}
        />
      </View>

      <Text className="mt-2 text-sm text-zinc-400">
        {habit.targetValue} {habit.unit ?? "times"} per {habit.frequency}
      </Text>
    </View>
  );
}
