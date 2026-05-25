import {
  calculateHabitProgress,
  formatDate,
  getIsFuture,
  HABIT_STATUS,
  type Completion,
  type Habit,
  type HabitStatus,
} from "@habitoo/core";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { CalendarDayActionModal } from "./calendar-day-action-modal";
import type { HabitAnalytics } from "./types";

type MonthCalendarProps = {
  analytics: HabitAnalytics;
  completions: Completion[];
  habit: Habit;
  isSaving?: boolean;
  anchorMonth?: Date;
  showHeader?: boolean;
  onMoveMonth?: (amount: number) => void;
  onAddCalendarLog: (date: string, value: number) => void;
  onFillRemaining: (date: string, value: number) => void;
  onSetStatus: (date: string, status: HabitStatus) => void;
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"] as const;

const getMonthDays = (anchor: Date) => {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const days: Array<Date | null> = Array.from({ length: first.getDay() }, () => null);

  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(anchor.getFullYear(), anchor.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

const getDateValue = (habit: Habit, completions: Completion[], date: string) => {
  return completions.reduce((total, completion) => {
    if (completion.habitId !== habit.id || completion.date !== date) {
      return total;
    }

    if (completion.value !== null && completion.value !== undefined) {
      return total + Number(completion.value);
    }

    if (completion.status === HABIT_STATUS.COMPLETED) {
      return total + 1;
    }

    return total;
  }, 0);
};

function MonthGrid({
  anchor,
  analytics,
  color,
  completions,
  habit,
  onOpenDay,
  onFillRemaining,
}: Pick<MonthCalendarProps, "analytics" | "completions" | "habit"> & {
  anchor: Date;
  color: string;
  onOpenDay: (date: string, current: number, remaining: number) => void;
  onFillRemaining: (date: string, value: number) => void;
}) {
  const days = useMemo(() => getMonthDays(anchor), [anchor]);
  const weeks = useMemo(() => {
    const rows: Array<Array<Date | null>> = [];

    for (let index = 0; index < days.length; index += 7) {
      rows.push(days.slice(index, index + 7));
    }

    return rows;
  }, [days]);
  const dayMeta = useMemo(() => {
    const map = new Map<
      string,
      {
        progress: ReturnType<typeof calculateHabitProgress>;
        value: number;
      }
    >();

    for (const date of days) {
      if (!date) continue;

      const key = formatDate(date);

      map.set(key, {
        progress: calculateHabitProgress(habit, completions, key),
        value: getDateValue(habit, completions, key),
      });
    }

    return map;
  }, [completions, days, habit]);
  const monthLabel = anchor.toLocaleDateString("default", { month: "short" });
  const isDailyHabit = habit.frequency === "day";

  const openDayActions = (date: string, disabled: boolean) => {
    if (disabled) return;

    const periodProgress =
      dayMeta.get(date)?.progress ??
      calculateHabitProgress(habit, completions, date);

    onOpenDay(
      date,
      periodProgress.current,
      Math.max(0, periodProgress.target - periodProgress.current)
    );
  };

  const fillRemaining = (date: string, disabled: boolean) => {
    if (disabled) return;

    const periodProgress =
      dayMeta.get(date)?.progress ??
      calculateHabitProgress(habit, completions, date);
    const remaining = Math.max(
      0,
      periodProgress.target - periodProgress.current
    );

    if (remaining <= 0) return;

    onFillRemaining(date, remaining);
  };

  return (
    <View className="min-w-0 flex-1">
      <Text className="mb-2 text-center text-xs font-semibold text-zinc-400">
        {monthLabel}
      </Text>

      <View className="mb-1 flex-row">
        {weekDays.map((day, index) => (
          <Text
            className="flex-1 text-center text-[10px] font-extrabold text-zinc-600"
            key={`${day}-${index}`}
          >
            {day}
          </Text>
        ))}
      </View>

      <View className="gap-0.5">
        {weeks.map((week, weekIndex) => (
          <View className="flex-row " key={`${monthLabel}-${weekIndex}`}>
            {week.map((date, index) => {
          const key = date ? formatDate(date) : "";
          const calendarCompleted = analytics.calendar.sets.completed.has(key);
          const skipped = analytics.calendar.sets.skipped.has(key);
          const failed = analytics.calendar.sets.failed.has(key);
          const disabled = !date || key < habit.startDate || getIsFuture(key);
          const meta = date ? dayMeta.get(key) : null;
          const hasLoggedDate = !!meta && meta.value > 0;
          const periodProgress = meta?.progress ?? null;
          const completed = isDailyHabit ? calendarCompleted : hasLoggedDate;
          const showPeriodGlow =
            !isDailyHabit &&
            !!periodProgress?.completed &&
            !hasLoggedDate &&
            !skipped &&
            !failed;
          const isPartial =
            isDailyHabit &&
            !!periodProgress &&
            periodProgress.current > 0 &&
            !completed &&
            !skipped &&
            !failed;

          return (
            <View className="min-w-0 flex-1" key={`${key}-${weekIndex}-${index}`}>
              <Pressable
                accessibilityRole="button"
                className="relative w-full h-7 items-center justify-center overflow-hidden"
                disabled={disabled}
                delayLongPress={250}
                onLongPress={() => openDayActions(key, disabled)}
                onPress={() => {
                  if (isDailyHabit) fillRemaining(key, disabled);
                }}
                style={{
                  backgroundColor: completed
                    ? color
                    : showPeriodGlow
                      ? `${color}4d`
                      : "#18181b",
                  opacity: disabled ? 0.22 : 1,
                }}
              >
                {isPartial ? (
                  <View
                    className="absolute inset-y-0 left-0 opacity-70"
                    style={{
                      backgroundColor: color,
                      width: `${periodProgress.percentage}%`,
                    }}
                  />
                ) : null}

                {skipped ? (
                  <ArrowRight color={color} size={13} strokeWidth={2.7} />
                ) : failed ? (
                  <X color="#f87171" size={13} strokeWidth={3} />
                ) : (
                  <Text
                    className={`text-[10px] font-semibold ${
                      completed || hasLoggedDate ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {date ? date.getDate() : ""}
                  </Text>
                )}
              </Pressable>
            </View>
          );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export function MonthCalendar({
  analytics,
  completions,
  habit,
  isSaving,
  anchorMonth: controlledAnchorMonth,
  showHeader = true,
  onMoveMonth,
  onAddCalendarLog,
  onFillRemaining,
  onSetStatus,
}: MonthCalendarProps) {
  const [internalAnchorMonth, setInternalAnchorMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const anchorMonth = controlledAnchorMonth ?? internalAnchorMonth;
  const color = habit.color || "#34d399";
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    current: number;
    remaining: number;
  } | null>(null);
  const previousMonth = useMemo(
    () => new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() - 1, 1),
    [anchorMonth]
  );
  const monthLabel = `${previousMonth.toLocaleDateString("default", {
    month: "short",
    year: "numeric",
  })} - ${anchorMonth.toLocaleDateString("default", {
    month: "short",
    year: "numeric",
  })}`;

  const moveMonth = (amount: number) => {
    if (onMoveMonth) {
      onMoveMonth(amount);
      return;
    }

    setInternalAnchorMonth((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + amount, 1);
      return next;
    });
  };

  return (
    <>
      <View className="border rounded-lg border-white/10 bg-zinc-900/80 px-3 pb-4 pt-3 ">
        {showHeader ? (
          <View className="mb-3 flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-950"
              onPress={() => moveMonth(-1)}
            >
              <ChevronLeft color="#d4d4d8" size={18} />
            </Pressable>
            <Text className="text-xs font-semibold text-zinc-400">{monthLabel}</Text>
            <Pressable
              accessibilityRole="button"
              className="h-9 w-9 items-center justify-center rounded-full bg-zinc-950"
              onPress={() => moveMonth(1)}
            >
              <ChevronRight color="#d4d4d8" size={18} />
            </Pressable>
          </View>
        ) : null}

        <View className="flex-row items-start gap-3">
          <MonthGrid
            analytics={analytics}
            anchor={previousMonth}
            color={color}
            completions={completions}
            habit={habit}
            onFillRemaining={onFillRemaining}
            onOpenDay={(date, current, remaining) =>
              setSelectedDay({ date, current, remaining })
            }
          />
          <MonthGrid
            analytics={analytics}
            anchor={anchorMonth}
            color={color}
            completions={completions}
            habit={habit}
            onFillRemaining={onFillRemaining}
            onOpenDay={(date, current, remaining) =>
              setSelectedDay({ date, current, remaining })
            }
          />
        </View>
      </View>

      <CalendarDayActionModal
        current={selectedDay?.current ?? 0}
        date={selectedDay?.date ?? null}
        habit={habit}
        isSaving={isSaving}
        open={!!selectedDay}
        remaining={selectedDay?.remaining ?? 0}
        onAddLog={onAddCalendarLog}
        onClose={() => setSelectedDay(null)}
        onFillRemaining={onFillRemaining}
        onSetStatus={onSetStatus}
      />
    </>
  );
}
