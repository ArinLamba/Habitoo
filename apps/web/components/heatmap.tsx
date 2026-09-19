"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { generateHeatmapGrid, getActiveHabits } from "@/lib/helper";

import { useDateStore } from "@/store/use-date-store";

import { useStats } from "@/hooks/use-stats";

import { Completion, Habit } from "@/lib/types";
import { indianFormat, parseLocalDate } from "@/lib/date";
import { useMemo } from "react";
import { calculateHabitProgress } from "@/lib/habits/progress";

type Props = {
  habits: Habit[];
  completions: Completion[];
  days?: number;
  habit?: Habit;
  title?: string;
};

export const Heatmap = ({
  habits,
  completions,
  days = 365,
  habit,
  title,
}: Props) => {

  const setCurrentDate  = useDateStore(state => state.setCurrentDate);
  const columnClass = "w-3 lg:w-2.5";
  const cellClass = "h-3 w-3 lg:h-2.5 lg:w-2.5";

  const activeHabits = useMemo(
    () =>
      habits.filter(
        (habit) => habit.lifecycle === "active"
      ),
    [habits]
  );

  const stats = useStats(activeHabits, completions);

  const data = stats.dayCount;
  const weeks = useMemo(() => generateHeatmapGrid(days), [days]);
  const habitCompletionMap = useMemo(() => {
    if (!habit) return null;

    const map = new Map<string, number>();

    weeks.flat().forEach((date) => {
      map.set(
        date,
        calculateHabitProgress(habit, completions, date).percentage
      );
    });

    return map;
  }, [completions, habit, weeks]);

  const activeHabitCountMap = useMemo(() => {
    const map = new Map<string, number>();

    weeks.flat().forEach((date) => {
      const activeForDate = getActiveHabits(
        activeHabits,
        parseLocalDate(date)
      );

      map.set(date, activeForDate.length);
    });

    return map;
  }, [weeks, activeHabits]);

  return (
    <div className="mx-auto inline-block">
      
      {/* Title */}
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 ">
        {title ?? `Consistency (Last ${days} days)`}
      </p>

      {/* Month Labels */}
      <div className="flex gap-[5px] mb-1 text-[10px] text-muted-foreground">
        <div className="w-5 shrink-0" /> {/* space for day labels */}

        {weeks.map((week, i) => {
          const currentMonth = parseLocalDate(week[0]).getMonth();
          const prevMonth =
            i > 0 ? parseLocalDate(weeks[i - 1][0]).getMonth() : null;

          const isNewMonth = currentMonth !== prevMonth;

          return (
            <div
              key={i}
              className={`${columnClass} shrink-0 text-left ${
                isNewMonth ? "font-medium" : ""
              }`}
            >
              {isNewMonth
                ? parseLocalDate(week[0]).toLocaleString("default", {
                    month: "short",
                  })
                : ""}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex gap-[5px]">
        
        {/* Day labels */}
        <div className="flex w-5 shrink-0 flex-col gap-[24px] text-[10px] text-muted-foreground ">
          <span>Sun</span>
          {/* <span>Mon</span>
          <span>Tue</span> */}
          <span>Wed</span>
          {/* <span>Thu</span>
          <span>Fri</span> */}
          <span>Sat</span>
        </div>

        {/* Weeks */}
        {weeks.map((week, i) => {
          return (
            <div
              key={i}
              className={`${columnClass} flex shrink-0 flex-col gap-[4px]`}
            >
              {week.map((date) => {
                const count = habit ? 0 : data.get(date) || 0;
                const parseDate = parseLocalDate(date);
                const totalHabits = activeHabitCountMap.get(date) || 0;

                const percentage = habitCompletionMap
                  ? (habitCompletionMap.get(date) ?? 0) / 100
                  : totalHabits === 0
                  ? 0
                  : count / totalHabits;

                const color =
                  progressColors[
                    percentage === 0
                      ? 0
                      : Math.floor(percentage * 10)
                  ];
                  
                const displayDate = indianFormat(parseDate);

                return (
                  <Tooltip key={date}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => setCurrentDate(parseLocalDate(date))}
                        className={`${cellClass} rounded-sm cursor-pointer transition-transform hover:scale-125 ${color}`}
                      />
                    </TooltipTrigger>

                    <TooltipContent side="top" className="text-xs px-2 py-1 rounded-md shadow-md pointer-events-none ">
                      {habit ? (
                        <p>{Math.round(percentage * 100)}% complete : {displayDate}</p>
                      ) : totalHabits ? (
                        <p>{count} / {totalHabits} Habits completed : {displayDate}</p>
                      ) : (
                        <p>No Active Habits on {displayDate}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 bg-gray-700 rounded-sm" />
        <div className="w-3 h-3 bg-blue-950 rounded-sm" />
        <div className="w-3 h-3 bg-blue-800 rounded-sm" />
        <div className="w-3 h-3 bg-blue-600 rounded-sm" />
        <div className="w-3 h-3 bg-blue-300 rounded-sm" />
        <span>More</span>
      </div>
    </div>
  );
};

const progressColors = [
  "bg-gray-700",
  "bg-blue-950", // 0–10%
  "bg-blue-900", // 10–20%
  "bg-blue-800", // 20–30%
  "bg-blue-700", // 30–40%
  "bg-blue-700", // 40–50%
  "bg-blue-600", // 50–60%
  "bg-blue-500", // 60–70%
  "bg-blue-400", // 70–80%
  "bg-blue-300", // 80–90%
  "bg-blue-300", // 90–100%
];