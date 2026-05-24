import {
  calculateHabitProgress,
  formatDisplayDate,
  getHabitPeriodStreaks,
  HABIT_STATUS,
  type Completion,
  type Habit,
  type HabitLifecycle,
  type HabitStatus,
} from "@habitoo/core";
import { ArrowRight, Check, Plus, X, Keyboard } from "lucide-react-native";
import { memo, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
} from "react-native";

import type { HabitSectionKind } from "../utils/group-habits";
import {
  HabitContextMenu,
  type HabitContextMenuAction,
} from "./habit-context-menu";
import { HabitLogModal } from "./habit-log-modal";
import { HabitProgressIcon } from "./habit-progress-icon";


type HabitListItemProps = {
  habit: Habit;
  completions: Completion[];
  selectedDate: string;
  sectionKind: HabitSectionKind;
  isLogging?: boolean;
  onAddLog: (habit: Habit, value: number) => void;
  onOpenDetails: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onSetStatus: (habit: Habit, status: HabitStatus) => void;
  onSetLifecycle: (habit: Habit, lifecycle: HabitLifecycle) => void;
};

const formatNumber = (value: number) => {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
};

function HabitListItemComponent({
  habit,
  completions,
  selectedDate,
  sectionKind,
  isLogging,
  onAddLog,
  onOpenDetails,
  onEdit,
  onSetStatus,
  onSetLifecycle,
}: HabitListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);

  const progress = useMemo(
    () => calculateHabitProgress(habit, completions, selectedDate),
    [habit, completions, selectedDate]
  );

  const streak = useMemo(
    () => getHabitPeriodStreaks(habit, completions, selectedDate),
    [habit, completions, selectedDate]
  );

  const color = habit.color || "#38bdf8";
  const unit = habit.unit || "times";
  const displayCurrent = Math.min(progress.current, progress.target);
  const remaining = Math.max(0, progress.target - progress.current);
  const beforeStartDate = selectedDate < habit.startDate;
  const canLog = !beforeStartDate;

  const showDoneButton = sectionKind === "frequency" && canLog;
  const showAddLogButton = sectionKind === "success" && canLog;
  const showSkippedMarker = sectionKind === "skipped";
  const showFailedMarker = sectionKind === "failed";
  const isCompletedRow = sectionKind === "success";

  const fillRemaining = () => {
    if (!canLog || remaining <= 0) return;
    onAddLog(habit, remaining);
  };

  const handleMenuAction = (action: HabitContextMenuAction, target: Habit) => {
    switch (action) {
      case "log-progress":
        setLogModalOpen(true);
        break;
      case "edit":
        onEdit(target);
        break;
      case "skip":
        onSetStatus(target, HABIT_STATUS.SKIPPED);
        break;
      case "fail":
        onSetStatus(target, HABIT_STATUS.FAILED);
        break;
      case "remove-progress":
        onSetStatus(target, null);
        break;
      case "end-habit":
        onSetLifecycle(target, "completed");
        break;
      case "archive-habit":
        onSetLifecycle(target, "archived");
        break;
      case "restore-habit":
        onSetLifecycle(target, "active");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        className="bg-zinc-950 px-4 py-3"
        delayLongPress={400}
        onLongPress={() => setMenuOpen(true)}
      >
        <View className="flex-row items-center gap-3">
          <HabitProgressIcon
            color={color}
            currentStreak={streak.currentStreak}
            icon={habit.icon}
            percentage={progress.percentage}
          />

          <View className="min-w-0 flex-1">
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpenDetails(habit)}
            >
              <Text
                className={`text-[18px] font-extrabold leading-tight ${
                  canLog ? "text-white" : "text-zinc-500"
                }`}
                numberOfLines={2}
                style={
                  isCompletedRow
                    ? {
                        textDecorationLine: "line-through",
                        textDecorationColor: "#71717a",
                      }
                    : undefined
                }
              >
                {habit.name}
              </Text>
            </Pressable>
            <Text className="mt-1 text-[14px] font-semibold text-zinc-500">
              {formatNumber(displayCurrent)} / {formatNumber(progress.target)}{" "}
              {unit}
            </Text>
            {beforeStartDate ? (
              <Text className="mt-1 text-[11px] font-bold text-amber-400/90">
                Not available on {formatDisplayDate(selectedDate)}
              </Text>
            ) : null}
          </View>

          <View className="min-w-[118px] items-end justify-center">
            {showDoneButton ? (
              <View className="flex-row items-center gap-2">
                <Pressable
                  accessibilityRole="button"
                  className="h-10 flex-row gap-x-2 px-2 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
                  onPress={() => setLogModalOpen(true)}
                >
                  <Keyboard color="#34d399" size={16} strokeWidth={3} />
                  <Text className="text-emerald-300 text-sm font-extrabold">Log</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className={`h-10 flex-row items-center gap-1 rounded-full border px-3 ${
                    progress.completed
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                  disabled={remaining <= 0}
                  onPress={fillRemaining}
                >
                  <Check
                    color={"#34d399"}
                    size={16}
                    strokeWidth={3}
                  />
                  <Text
                    className={`text-sm font-extrabold ${
                      "text-emerald-300" 
                    }`}
                  >
                    Done
                  </Text>
                </Pressable>

                
              </View>
            ) : null}

            {showAddLogButton ? (
              <Pressable
                accessibilityRole="button"
                className="h-10 flex-row items-center gap-1 rounded-full border border-zinc-500/40 bg-zinc-500/10 px-3"
                onPress={() => setLogModalOpen(true)}
              >
                <Keyboard color="#71717a" size={16} strokeWidth={3} />
                <Text className="text-sm font-extrabold text-zinc-500">
                  log
                </Text>
              </Pressable>
            ) : null}

            {showSkippedMarker ? (
              <View className="h-8 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <ArrowRight color="#a1a1aa" size={18} strokeWidth={2.5} />
              </View>
            ) : null}

            {showFailedMarker ? (
              <View className="h-8 w-10 items-center justify-center rounded-full border border-red-900/50 bg-red-950/40">
                <X color="#f87171" size={18} strokeWidth={2.5} />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      <HabitContextMenu
        canLog={canLog}
        habit={habit}
        isDoneForDate={progress.completed}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={handleMenuAction}
      />

      <HabitLogModal
        habit={habit}
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onSubmit={(value) => {
          onAddLog(habit, value);
          setLogModalOpen(false);
        }}
      />
    </>
  );
}

export const HabitListItem = memo(HabitListItemComponent);
