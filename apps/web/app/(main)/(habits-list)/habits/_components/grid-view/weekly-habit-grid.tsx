"use client";

import { Check } from "lucide-react";

import { Completion, Habit, HabitStatus } from "@/lib/types";
import { calculateHabitProgress, getPeriodDates } from "@/lib/habits/progress";
import { getIsFuture } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useAddLog } from "@/hooks/mutations/use-add-log";
import { useHabitActions } from "@/hooks/use-habit-actions";
import { useSelectedCellStore } from "@/store/use-selected-cell-store";
import { useVisibleDays } from "@/hooks/use-visible-days";

import { DayCell } from "./day-cell";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
};

type WeekBlock = {
  key: string;
  label: string;
  startDate: string;
  colStart: number;
  colSpan: number;
  dates: string[];
};

const getWeekNumber = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays =
    (date.getTime() - firstDay.getTime()) / 86400000;

  return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
};

const getPeriodBlock = (
  frequency: Habit["frequency"],
  date: string
) => {
  const d = new Date(`${date}T00:00:00`);
  const range = getPeriodDates(frequency, date);

  if (frequency === "week") {
    return {
      key: `week-${range.start}`,
      label: `W${getWeekNumber(d)}`,
      startDate: range.start,
    };
  }

  if (frequency === "month") {
    return {
      key: `month-${range.start}`,
      label: d.toLocaleString("default", { month: "short" }),
      startDate: range.start,
    };
  }

  return {
    key: `year-${range.start}`,
    label: d.getFullYear().toString(),
    startDate: range.start,
  };
};

const getDayProgress = (
  habit: Habit,
  completions: Completion[],
  date: string
) => {
  const current = completions.reduce((total, completion) => {
    if (
      completion.habitId !== habit.id ||
      completion.date !== date
    ) {
      return total;
    }

    if (completion.value !== null) {
      return total + Number(completion.value);
    }

    if (completion.status === "completed") {
      return total + 1;
    }

    return total;
  }, 0);

  return {
    current,
    target: 1,
    completed: current >= 1,
    percentage: current >= 1 ? 100 : 0,
  };
};

export const WeeklyHabitGrid = ({
  habit,
  completions,
  statusMap,
}: Props) => {
  const days = useVisibleDays();
  const { mutate: addLog } = useAddLog();
  const { toggle } = useHabitActions({ statusMap });
  const setSelectedCell = useSelectedCellStore(
    (state) => state.setSelectedCell
  );

  const weeks: WeekBlock[] = [];

  days.forEach((day, index) => {
    const period = getPeriodBlock(habit.frequency, day.date);

    const existing = weeks.find((week) => week.key === period.key);

    if (existing) {
      existing.colSpan += 1;
      existing.dates.push(day.date);
      return;
    }

    weeks.push({
      key: period.key,
      label: period.label,
      startDate: period.startDate,
      colStart: index + 1,
      colSpan: 1,
      dates: [day.date],
    });
  });

  return (
    <div
      className="grid w-full min-w-0"
      style={{
        gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
      }}
    >
      {weeks.map((week) => {
        const progress = calculateHabitProgress(
          habit,
          completions,
          week.startDate
        );

        const displayCurrent = Math.min(
          progress.current,
          progress.target
        );

        const isCompleted =
          displayCurrent >= progress.target;

        const percentage =
          progress.target === 0
            ? 0
            : (displayCurrent / progress.target) * 100;

        return (
          <div
            key={week.key}
            className="relative h-9 overflow-hidden border-r border-black/10 dark:border-white/10 bg-cyan-950/30 text-cyan-400"
            style={{
              gridColumn: `${week.colStart} / span ${week.colSpan}`,
            }}
          >
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{
                width: `${percentage}%`,
                backgroundColor: habit.color!,
                // opacity: isCompleted ? 1 : 0.40,
                opacity: isCompleted ? 0.95 : 0.60,
                filter: isCompleted ? "none" : "saturate(0.7)",
              }}
            />

            <div className="relative z-10 h-full">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 pr-2 z-20 flex items-center justify-between text-[11px] text-white font-semibold leading-none">
                <span>{week.label}</span>
                <span className="flex items-center gap-1">
                  {displayCurrent} / {progress.target}
                  {isCompleted && <Check className="h-3 w-3 " />}
                </span>
              </div>

              <div
                className="grid h-full pt-0"
                style={{
                  gridTemplateColumns: `repeat(${week.dates.length}, minmax(0, 1fr))`,
                }}
              >
                {week.dates.map((date, index) => {
                  const key = `${habit.id}-${date}`;
                  const isBeforeStart = habit.startDate > date;
                  const isFuture = getIsFuture(date);
                  const isDisabled = isBeforeStart || isFuture;
                  const filledUntilIndex =
                    (percentage / 100) * week.dates.length;

                  const isInsideFilledArea =
                    index < filledUntilIndex;

                  return (
                    <div
                      key={date}
                      className={cn(
                        "border-l border-black/10 first:border-l-0 dark:border-white/10",
                        (isCompleted || isInsideFilledArea) && "text-white"
                      )}
                    >
                      <DayCell
                        habitId={habit.id}
                        date={date}
                        status={statusMap.get(key) ?? null}
                        color={habit.color!}
                        isDisabled={isDisabled}
                        isFuture={isFuture}
                        variant="bg-transparent hover:bg-white/10"
                        isBeforeStart={isBeforeStart}
                        progress={getDayProgress(
                          habit,
                          completions,
                          date
                        )}
                        transparentFill
                        textColor={
                          isInsideFilledArea
                            ? "text-blue-950"
                            : "text-white/80"
                        }
                        unit={habit.unit!}
                        setSelectedCell={setSelectedCell}
                        fillRemaining={() => {
                          addLog({
                            habitId: habit.id,
                            date,
                            value: 1,
                          });
                        }}
                        addValue={(value) => {
                          addLog({
                            habitId: habit.id,
                            date,
                            value,
                          });
                        }}
                        toggle={toggle}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
