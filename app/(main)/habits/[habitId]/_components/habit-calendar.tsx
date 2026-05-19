"use client";
import { formatDate, getIsFuture } from "@/lib/date";
import { calculateHabitProgress } from "@/lib/habits/progress";
import { Completion, Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";


import { useHabitActions } from "@/hooks/use-habit-actions";
import { useAddLog } from "@/hooks/mutations/use-add-log";

import { useSelectedCellStore } from "@/store/use-selected-cell-store";

type Sets = {
  completed: Set<string>;
  skipped: Set<string>;
  failed: Set<string>;
};

type Props = {
  habit: Habit;
  color: string;
  calendar: Sets;
  completions: Completion[];
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const getMonthMeta = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth(),
});

function MonthGrid({
  habit,
  year,
  month,
  calendar,
  color,
  completions,
}: {
  habit: Habit;
  year: number;
  month: number;
  calendar: Sets;
  color: string;
  completions: Completion[];
}) {
  const { completed, skipped, failed } = calendar;
  const { mutate: addLog } = useAddLog();
  const setSelectedCell = useSelectedCellStore(
    (state) => state.setSelectedCell
  );

  const statusMap = useMemo(() => {
    const map = new Map<string, HabitStatus>();

    completed.forEach((date) =>
      map.set(`${habit.id}-${date}`, HABIT_STATUS.COMPLETED)
    );
    skipped.forEach((date) =>
      map.set(`${habit.id}-${date}`, HABIT_STATUS.SKIPPED)
    );
    failed.forEach((date) =>
      map.set(`${habit.id}-${date}`, HABIT_STATUS.FAILED)
    );

    return map;
  }, [completed, failed, habit.id, skipped]);

  const { toggle } = useHabitActions({ statusMap });

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  for (let i = 0; i < start.getDay(); i++) {
    days.unshift(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectDate = (date: string) => {
    setSelectedCell({
      habitId: habit.id,
      date,
    });
  };

  const fillRemaining = (date: string) => {
    const progress = calculateHabitProgress(
      habit,
      completions,
      date
    );
    const remaining = progress.target - progress.current;

    selectDate(date);

    if (remaining <= 0) return;

    addLog({
      habitId: habit.id,
      date,
      value: remaining,
    });
  };

  const markStatus = (
    date: string,
    status: HabitStatus
  ) => {
    selectDate(date);
    toggle(habit.id, date, status);
  };

  return (
    <div className="space-y-1">
      <div className="text-[12px] text-zinc-400 text-center mb-1">
        {start.toLocaleString("default", { month: "short" })}
      </div>

      <div className="grid grid-cols-7 text-[10px] text-zinc-500 font-bold">
        {weekDays.map((day, index) => (
          <div key={`${day}-${index}`} className="text-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-7 w-7 lg:w-13 my-px" />;
          }

          const key = formatDate(date);
          const progress = calculateHabitProgress(
            habit,
            completions,
            key
          );
          const isCompleted = completed.has(key);
          const isSkipped = skipped.has(key);
          const isFailed = failed.has(key);
          const isPartial =
            progress.current > 0 &&
            !isCompleted &&
            !isSkipped &&
            !isFailed;
          const isToday = key === formatDate(today);
          const isDisabled =
            key < habit.startDate ||
            getIsFuture(key);

          return (
            <ContextMenu key={key}>
              <ContextMenuTrigger asChild>
                <button
                  disabled={isDisabled}
                  onClick={() => fillRemaining(key)}
                  className={cn(
                    "relative h-7 w-7 lg:w-13 my-px overflow-hidden flex items-center justify-center lg:text-[10px] text-[8px] transition",
                    "border border-transparent hover:border-black/10 dark:hover:border-white/10",
                    isDisabled && "opacity-20 cursor-not-allowed",
                    isToday && "rounded-r-lg"
                  )}
                  style={
                    isCompleted
                      ? { backgroundColor: color }
                      : undefined
                  }
                >
                  {isPartial && (
                    <div
                      className="absolute inset-y-0 left-0 opacity-70"
                      style={{
                        width: `${progress.percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-center">
                     {isSkipped ? (
                      <ArrowRight size={14} color={color} />
                    ) : isFailed ? (
                      <X size={14} color="red" />
                    ) : (
                      date.getDate()
                    )}
                  </span>
                </button>
              </ContextMenuTrigger>

              <ContextMenuContent className="w-56">
                <ContextMenuItem
                  onClick={() => fillRemaining(key)}
                  disabled={isDisabled}
                >
                  Fill Remaining
                  <ContextMenuShortcut>Alt + D</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={() => markStatus(key, HABIT_STATUS.SKIPPED)}
                  disabled={isDisabled}
                >
                  Mark as Skipped
                  <ContextMenuShortcut>Alt + S</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuItem
                  onClick={() => markStatus(key, HABIT_STATUS.FAILED)}
                  disabled={isDisabled}
                >
                  Mark as Failed
                  <ContextMenuShortcut>Alt + F</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem
                  onClick={() => markStatus(key, null)}
                  disabled={isDisabled}
                >
                  Clear Logs
                  <ContextMenuShortcut>Del</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
}

export const HabitCalendar = ({
  habit,
  color,
  calendar,
  completions,
}: Props) => {
  const [anchorMonth, setAnchorMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const previous = new Date(
    anchorMonth.getFullYear(),
    anchorMonth.getMonth() - 1,
    1
  );

  const goPrevious = () => {
    setAnchorMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() - 1,
          1
        )
    );
  };

  const goNext = () => {
    setAnchorMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1
        )
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={goPrevious}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </Button>

        <p className="text-xs font-medium text-muted-foreground">
          {previous.toLocaleString("default", { month: "short" })}{" "}
          {previous.getFullYear()} -{" "}
          {anchorMonth.toLocaleString("default", { month: "short" })}{" "}
          {anchorMonth.getFullYear()}
        </p>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={goNext}
          aria-label="Next month"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="flex gap-4 items-start justify-center">
        <MonthGrid
          {...getMonthMeta(previous)}
          habit={habit}
          calendar={calendar}
          color={color}
          completions={completions}
        />
        <MonthGrid
          {...getMonthMeta(anchorMonth)}
          habit={habit}
          calendar={calendar}
          color={color}
          completions={completions}
        />
      </div>
    </div>
  );
};
