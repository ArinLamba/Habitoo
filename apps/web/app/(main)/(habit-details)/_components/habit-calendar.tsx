"use client";
import { formatDate, getIsFuture } from "@/lib/date";
import { calculateHabitProgress } from "@/lib/habits/progress";
import { Completion, Habit, HABIT_STATUS, HabitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

import { useMemo, useState } from "react";
import {
  ArrowRight,
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
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


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

const getClickedDateProgress = (
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

    if (completion.status === HABIT_STATUS.COMPLETED) {
      return total + 1;
    }

    return total;
  }, 0);

  return {
    current,
    target: habit.targetValue,
    completed: current >= habit.targetValue,
    percentage:
      habit.targetValue === 0
        ? 0
        : Math.min(100, Math.round((current / habit.targetValue) * 100)),
  };
};

const getDateValue = (
  habit: Habit,
  completions: Completion[],
  date: string
) => {
  return completions.reduce((total, completion) => {
    if (
      completion.habitId !== habit.id ||
      completion.date !== date
    ) {
      return total;
    }

    if (completion.value !== null) {
      return total + Number(completion.value);
    }

    if (completion.status === HABIT_STATUS.COMPLETED) {
      return total + 1;
    }

    return total;
  }, 0);
};

function DailyProgressRing({
  color,
  percentage,
}: {
  color: string;
  percentage: number;
}) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, percentage) / 100);

  return (
    <svg
      aria-hidden
      className="absolute inset-0 m-auto h-7 w-7 -rotate-90"
      viewBox="0 0 32 32"
    >
      <circle
        cx="16"
        cy="16"
        fill="none"
        r={radius}
        stroke={`${color}24`}
        strokeWidth="3"
      />
      <circle
        cx="16"
        cy="16"
        fill="none"
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

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
  const isDailyHabit = habit.frequency === "day";
  const [logValue, setLogValue] = useState(1);

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
    const periodProgress = calculateHabitProgress(
      habit,
      completions,
      date
    );
    const remaining = periodProgress.target - periodProgress.current;

    selectDate(date);

    if (remaining <= 0) return;

    addLog({
      habitId: habit.id,
      date,
      value: remaining,
    });
  };

  const addValue = (date: string, value: number) => {
    selectDate(date);
    if (!Number.isFinite(value) || value <= 0) return;

    addLog({
      habitId: habit.id,
      date,
      value,
    });
  };

  const markStatus = (
    date: string,
    status: HabitStatus | null
  ) => {
    selectDate(date);
    toggle(habit.id, date, status);
  };

  return (
    <div className="flex-1 min-w-0 space-y-1">
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
            return <div key={`empty-${index}`} className="h-8 w-full my-px" />;
          }

          const key = formatDate(date);
          const dateProgress = getClickedDateProgress(
            habit,
            completions,
            key
          );
          const periodProgress = calculateHabitProgress(
            habit,
            completions,
            key
          );
          const hasLoggedDate = getDateValue(habit, completions, key) > 0;
          const isCompleted = isDailyHabit
            ? dateProgress.completed
            : hasLoggedDate;
          const isPeriodComplete = periodProgress.completed;
          const isSkipped = skipped.has(key);
          const isFailed = failed.has(key);
          const isPartial =
            isDailyHabit &&
            dateProgress.current > 0 &&
            !isCompleted &&
            !isSkipped &&
            !isFailed;
          const showDailyRing =
            isDailyHabit &&
            dateProgress.current > 0 &&
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
                  onClick={() => {
                    if (isDailyHabit) fillRemaining(key);
                  }}
                  className={cn(
                    "relative h-8 w-full my-px overflow-hidden flex items-center justify-center lg:text-[10px] text-[10px] transition",
                    "border border-transparent hover:border-black/10 dark:hover:border-white/10",
                    isDisabled && "opacity-20 cursor-not-allowed",
                    isToday && "rounded-r-lg"
                  )}
                  style={
                    isDailyHabit && isCompleted
                      ? { backgroundColor: color }
                      : !isDailyHabit && isCompleted
                      ? { backgroundColor: color }
                      : !isDailyHabit && isPeriodComplete
                      ? { backgroundColor: `${color}4d` }
                      : undefined
                  }
                >
                  {isPartial && !showDailyRing && (
                    <div
                      className="absolute inset-y-0 left-0 opacity-70"
                      style={{
                        width: `${dateProgress.percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  )}
                  {showDailyRing ? (
                    <DailyProgressRing
                      color={color}
                      percentage={dateProgress.percentage}
                    />
                  ) : null}

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

                <ContextMenuSub>
                  <ContextMenuSubTrigger disabled={isDisabled}>
                    Add Logs
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-50">
                    <div className="flex">
                      <InputGroup>
                        <InputGroupInput
                          placeholder="log.."
                          value={logValue}
                          onChange={(event) =>
                            setLogValue(
                              Math.max(0, Number(event.target.value))
                            )
                          }
                          onKeyDown={(event) => {
                            if (event.key !== "Enter") return;
                            event.preventDefault();
                            addValue(key, logValue);
                          }}
                        />
                        <InputGroupAddon align="inline-end" className="flex">
                          <p>{habit.unit ?? "times"}</p>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => addValue(key, logValue)}
                          >
                            +
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                    {[1, Math.max(1, Math.round(periodProgress.target / 2)), periodProgress.target].map(
                      (value, valueIndex) => (
                        <ContextMenuItem
                          key={`${value}-${valueIndex}`}
                          onClick={() => addValue(key, value)}
                        >
                          +{value} {habit.unit ?? "times"}
                        </ContextMenuItem>
                      )
                    )}
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      disabled={
                        Math.max(
                          0,
                          periodProgress.target - periodProgress.current
                        ) <= 0
                      }
                      onClick={() => fillRemaining(key)}
                    >
                      Fill Remaining (
                      {Math.max(
                        0,
                        periodProgress.target - periodProgress.current
                      )}{" "}
                      {habit.unit ?? "times"})
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>

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

      <div className="flex gap-4 w-full items-start">
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
