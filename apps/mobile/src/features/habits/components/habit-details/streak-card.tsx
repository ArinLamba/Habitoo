import {
  formatDate,
  getPeriodDates,
  type Habit,
} from "@habitoo/core";
import { ArrowRight, Check, Flame, X } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import type { HabitAnalytics } from "./types";

type StreakCardProps = {
  analytics: HabitAnalytics;
  habit: Habit;
};

type CalendarSets = HabitAnalytics["calendar"]["sets"];

const railLengthByFrequency: Record<Habit["frequency"], number> = {
  day: 7,
  week: 7,
  month: 6,
  year: 5,
};

const getWeekNumber = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date.getTime() - firstDay.getTime()) / 86400000;

  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const hasDateInRange = (dates: Set<string>, start: string, end: string) => {
  for (const date of dates) {
    if (date >= start && date <= end) return true;
  }

  return false;
};

const getRailLabel = (frequency: Habit["frequency"], date: Date) => {
  if (frequency === "day") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  if (frequency === "week") {
    return `W${getWeekNumber(date)}`;
  }

  if (frequency === "month") {
    return date.toLocaleDateString("en-US", { month: "short" });
  }

  return date.getFullYear().toString();
};

const getRailItems = (frequency: Habit["frequency"], calendar: CalendarSets) => {
  const count = railLengthByFrequency[frequency];
  const today = new Date();

  return [...Array(count)].map((_, index) => {
    const offset = count - 1 - index;
    const date = new Date(today);

    if (frequency === "day") date.setDate(today.getDate() - offset);
    if (frequency === "week") date.setDate(today.getDate() - offset * 7);
    if (frequency === "month") date.setMonth(today.getMonth() - offset);
    if (frequency === "year") date.setFullYear(today.getFullYear() - offset);

    const { start, end } = getPeriodDates(frequency, formatDate(date));

    return {
      key: `${frequency}-${start}`,
      label: getRailLabel(frequency, date),
      isDone: hasDateInRange(calendar.completed, start, end),
      isSkipped: hasDateInRange(calendar.skipped, start, end),
      isFailed: hasDateInRange(calendar.failed, start, end),
    };
  });
};

const getStreakMessage = (streak: number) => {
  if (streak === 0) {
    return {
      title: "Start your streak today",
      message: "One small action is enough to begin.",
    };
  }

  if (streak <= 2) {
    return {
      title: "Good start",
      message: "Keep going tomorrow to lock it in.",
    };
  }

  if (streak <= 5) {
    return {
      title: "Building consistency",
      message: "You are forming a real habit.",
    };
  }

  if (streak <= 10) {
    return {
      title: "On fire",
      message: "Momentum is building fast.",
    };
  }

  if (streak <= 20) {
    return {
      title: "Strong discipline",
      message: "This is becoming part of your routine.",
    };
  }

  return {
    title: "Legendary streak",
    message: "This habit is part of your identity now.",
  };
};

const gridCells = [
  { col: 2, row: 3, color: "rgba(255,122,43,0.08)" },
  { col: 3, row: 4, color: "rgba(255,194,138,0.16)" },
  { col: 4, row: 2, color: "rgba(255,194,138,0.08)" },
  { col: 4, row: 5, color: "rgba(255,122,43,0.14)" },
  { col: 5, row: 4, color: "rgba(255,194,138,0.20)" },
  { col: 6, row: 6, color: "rgba(255,194,138,0.14)" },
  { col: 7, row: 2, color: "rgba(255,194,138,0.08)" },
  { col: 7, row: 5, color: "rgba(255,122,43,0.12)" },
  { col: 8, row: 7, color: "rgba(255,194,138,0.18)" },
  { col: 9, row: 4, color: "rgba(255,194,138,0.18)" },
  { col: 10, row: 3, color: "rgba(255,122,43,0.10)" },
  { col: 11, row: 5, color: "rgba(255,194,138,0.14)" },
];

function SubtleGrid() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View className="absolute inset-0 bg-[#141414]" />
      <View
        className="absolute left-1/2 top-7 h-56 w-[78%] -translate-x-[39%] overflow-hidden"
        style={{ opacity: 0.95 }}
      >
        {Array.from({ length: 13 }).map((_, index) => (
          <View
            className="absolute bottom-0 top-0 bg-white"
            key={`v-${index}`}
            style={{
              left: `${(index / 12) * 100}%`,
              opacity: 0.055,
              width: StyleSheet.hairlineWidth,
            }}
          />
        ))}
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            className="absolute left-0 right-0 bg-white"
            key={`h-${index}`}
            style={{
              height: StyleSheet.hairlineWidth,
              opacity: 0.055,
              top: `${(index / 8) * 100}%`,
            }}
          />
        ))}
        {gridCells.map((cell) => (
          <View
            className="absolute"
            key={`${cell.col}-${cell.row}`}
            style={{
              backgroundColor: cell.color,
              height: "12.5%",
              left: `${((cell.col - 1) / 12) * 100}%`,
              top: `${((cell.row - 1) / 8) * 100}%`,
              width: "8.333%",
            }}
          />
        ))}
      </View>
      <View
        className="absolute inset-x-0 top-0 h-20 bg-[#141414]"
        style={{ opacity: 0.72 }}
      />
      <View
        className="absolute inset-x-0 top-56 h-24 bg-[#141414]"
        style={{ opacity: 0.82 }}
      />
      <View
        className="absolute bottom-0 left-0 top-0 w-16 bg-[#141414]"
        style={{ opacity: 0.82 }}
      />
      <View
        className="absolute bottom-0 right-0 top-0 w-16 bg-[#141414]"
        style={{ opacity: 0.82 }}
      />
    </View>
  );
}

export function StreakCard({ analytics, habit }: StreakCardProps) {

  const currentStreak = analytics.streaks.currentStreak;
  const frequencyLabel =
    habit.frequency === "day"
      ? "day"
      : habit.frequency === "week"
        ? "week"
        : habit.frequency === "month"
          ? "month"
          : "year";
  const railItems = getRailItems(habit.frequency, analytics.calendar.sets);
  const completedCount = railItems.filter((item) => item.isDone).length;
  const startLabel = railItems[0]?.label ?? "";
  const endLabel = railItems[railItems.length - 1]?.label ?? "";
  const { message } = getStreakMessage(currentStreak);

  return (
    <View className="relative min-h-[360px] overflow-hidden bg-[#141414] px-6 py-7">
      <SubtleGrid />

      <View className="items-center justify-center">
        <View className="relative h-40 w-40 items-center justify-center">
          <Flame
            className="absolute"
            color="#ff7a2b"
            fill="#ff7a2b"
            size={132}
            strokeWidth={1.5}
          />
          <Text
            className="absolute translate-y-8 text-6xl font-[900]"
            style={{
              textShadowColor: "#111111",
              textShadowOffset: { width: 0, height: 5 },
              textShadowRadius: 0,
            }}
          >
            {currentStreak}
          </Text>
        </View>

        <Text className="mt-1 text-2xl font-extrabold leading-none text-white">
          {frequencyLabel} streak!
        </Text>
        <Text className="mt-5 max-w-[270px] text-center text-lg font-medium leading-7 text-zinc-500">
          {message}
        </Text>
      </View>

      <View className="mt-8">
        <View className="flex-row items-start justify-between">
          {railItems.map((item) => (
            <View
              key={item.key}
              className="items-center"
              style={{ width: `${100 / railItems.length}%` }}
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: item.isDone
                    ? "#ff7a2b"
                    : item.isFailed
                      ? "#451a1a"
                      : item.isSkipped
                        ? "#27272a"
                        : "#18181b",
                }}
              >
                {item.isDone ? (
                  <Check color="#111111" size={20} strokeWidth={3.5} />
                ) : item.isSkipped ? (
                  <ArrowRight color="#a1a1aa" size={17} strokeWidth={3} />
                ) : item.isFailed ? (
                  <X color="#f87171" size={17} strokeWidth={3} />
                ) : null}
              </View>
              <Text className="mt-2 text-xs font-medium text-zinc-500" numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-xs font-extrabold text-zinc-300">{startLabel}</Text>
          <Text className="text-xs font-extrabold text-zinc-300">
            {completedCount}/{railItems.length}
          </Text>
          <Text className="text-xs font-extrabold text-zinc-300">{endLabel}</Text>
        </View>
      </View>
    </View>
  );
}
