import {
  formatDate,
  HABIT_STATUS,
  type Completion,
  type Habit,
} from "@habitoo/core";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { getMonthDays, getMonthLabel } from "../utils/month";

type MonthlyTrendProps = {
  habits: Habit[];
  completions: Completion[];
};

export function MonthlyTrend({ habits, completions }: MonthlyTrendProps) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const activeHabitIds = useMemo(() => {
    return new Set(
      habits.filter((habit) => habit.lifecycle === "active").map((habit) => habit.id)
    );
  }, [habits]);

  const data = useMemo(() => {
    const completedByDate = new Map<string, Set<string>>();

    completions.forEach((completion) => {
      if (!activeHabitIds.has(completion.habitId)) return;
      if (completion.status !== HABIT_STATUS.COMPLETED) return;

      if (!completedByDate.has(completion.date)) {
        completedByDate.set(completion.date, new Set());
      }

      completedByDate.get(completion.date)?.add(completion.habitId);
    });

    return getMonthDays(month).map((date) => {
      const key = formatDate(date);
      return {
        date: date.getDate().toString(),
        habits: completedByDate.get(key)?.size ?? 0,
      };
    });
  }, [activeHabitIds, completions, month]);

  const total = data.reduce((sum, point) => sum + point.habits, 0);
  const peak = Math.max(...data.map((point) => point.habits), 0);
  const visibleBars = data.filter((_, index) => index % 2 === 0 || data.length <= 16);

  const shiftMonth = (amount: number) => {
    setMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  return (
    <View className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-extrabold uppercase text-zinc-500">
            Monthly trend
          </Text>
          <Text className="mt-1 text-lg font-extrabold text-white">
            Habits completed per day
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            className="h-9 w-9 items-center justify-center rounded-full bg-zinc-800"
            onPress={() => shiftMonth(-1)}
          >
            <ChevronLeft color="#d4d4d8" size={18} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="h-9 w-9 items-center justify-center rounded-full bg-zinc-800"
            onPress={() => shiftMonth(1)}
          >
            <ChevronRight color="#d4d4d8" size={18} />
          </Pressable>
        </View>
      </View>

      <Text className="mt-3 text-sm font-bold text-zinc-300">
        {getMonthLabel(month)}
      </Text>

      <View className="mt-4 flex-row gap-3">
        <View className="rounded-md bg-zinc-800 px-3 py-2">
          <Text className="text-xs font-semibold text-zinc-500">Total</Text>
          <Text className="mt-1 text-base font-extrabold text-white">{total}</Text>
        </View>
        <View className="rounded-md bg-zinc-800 px-3 py-2">
          <Text className="text-xs font-semibold text-zinc-500">Best day</Text>
          <Text className="mt-1 text-base font-extrabold text-white">{peak}</Text>
        </View>
      </View>

      <View className="mt-5 h-32 flex-row items-end gap-1">
        {visibleBars.map((point) => {
          const height = peak === 0 ? 4 : Math.max(4, (point.habits / peak) * 112);

          return (
            <View className="flex-1 items-center justify-end" key={point.date}>
              <View
                className="w-full rounded-t-sm bg-emerald-500"
                style={{ height }}
              />
            </View>
          );
        })}
      </View>
      <View className="mt-2 flex-row justify-between">
        <Text className="text-[10px] font-bold text-zinc-600">1</Text>
        <Text className="text-[10px] font-bold text-zinc-600">
          {data.length}
        </Text>
      </View>
    </View>
  );
}
