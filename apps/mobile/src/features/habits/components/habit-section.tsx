import {
  formatDisplayDate,
  type Completion,
  type Habit,
  type HabitLifecycle,
  type HabitStatus,
} from "@habitoo/core";
import { ChevronDown } from "lucide-react-native";
import { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import type { HabitSectionKind } from "../utils/group-habits";
import { Separator } from "./separator";
import { HabitListItem } from "./habit-list-item";

type HabitSectionProps = {
  title: string;
  kind: HabitSectionKind;
  habits: Habit[];
  completions: Completion[];
  selectedDate: string;
  pendingHabitId?: string;
  isLogging?: boolean;
  onAddLog: (habit: Habit, value: number) => void;
  onOpenDetails: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onSetStatus: (habit: Habit, status: HabitStatus) => void;
  onSetLifecycle: (habit: Habit, lifecycle: HabitLifecycle) => void;
};

const sectionAccent: Partial<
  Record<HabitSectionKind, { border: string; bg: string; title: string; count: string }>
> = {
  success: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.04]",
    title: "text-emerald-600",
    count: "text-emerald-600",
  },
  skipped: {
    border: "border-zinc-700",
    bg: "bg-zinc-900/60",
    title: "text-zinc-400",
    count: "text-zinc-600",
  },
  failed: {
    border: "border-red-900/30",
    bg: "bg-red-950/20",
    title: "text-red-400/90",
    count: "text-red-400/70",
  },
};

export const HabitSection = memo(function HabitSection({
  title,
  kind,
  habits,
  completions,
  selectedDate,
  pendingHabitId,
  isLogging,
  onAddLog,
  onOpenDetails,
  onEdit,
  onSetStatus,
  onSetLifecycle,
}: HabitSectionProps) {
  const [open, setOpen] = useState(kind !== "success");
  const accent = sectionAccent[kind] ?? {
    border: "border-zinc-800",
    bg: "bg-zinc-900/60",
    title: "text-zinc-400",
    count: "text-zinc-600",
  };
  const isSuccess = kind === "success";
  const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(open ? "180deg" : "0deg", { duration: 200 }),
      },
    ],
    color: isSuccess ? "#6ee7b7" : "#52525b",
  }));

  return (
    <View className="mt-2">
      <Pressable
        accessibilityRole="button"
        className={`flex-row items-center justify-between border px-7 py-2 ${accent.border} ${accent.bg}`}
        onPress={() => setOpen((current) => !current)}
      >
        <View className={` flex-row gap-x-1 `}>
          <Text className={`text-sm ${accent.title} font-extrabold uppercase tracking-wide `}>
            {title}
            {isSuccess ? ` ${formatDisplayDate(selectedDate)}` : ""}
          </Text>
          <Text className={`text-sm ${accent.title} font-extrabold uppercase tracking-wide `}>({habits.length})</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <AnimatedChevron size={18} style={animatedStyle} />
        </View>
      </Pressable>

      {open
        ? habits.map((habit) => (
            <View key={habit.id}>
              <HabitListItem
                habit={habit}
                completions={completions}
                sectionKind={kind}
                selectedDate={selectedDate}
                isLogging={isLogging && pendingHabitId === habit.id}
                onAddLog={onAddLog}
                onEdit={onEdit}
                onOpenDetails={onOpenDetails}
                onSetLifecycle={onSetLifecycle}
                onSetStatus={onSetStatus}
              />
              <Separator />
            </View>
          ))
        : null}
    </View>
  );
});
