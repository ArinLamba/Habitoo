"use client";

import { formatDate, getDaysInMonth } from "@/lib/helper";
import { Habit } from "@/lib/types";
import { useCompletionsStore } from "@/store/use-completions-store";
import { useDateStore } from "@/store/use-date-store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  habit: Habit;
};

export const HabitCalendar = ({
  habit,

}: Props) => {

  const completions = useCompletionsStore((s) => s.completions);
  // filter only this habit
  const { currentDate, setCurrentDate } = useDateStore();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based


  const days = getDaysInMonth(currentDate);

  const map = new Map<string, boolean>();
  completions
    .filter(c => c.habitId === habit.id)
    .forEach(c => map.set(c.date, c.completed!));

  const monthLabel = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };


  const getStreakDates = () => {
    const doneDates = completions
      .filter(c => c.habitId === habit.id && c.completed)
      .map(c => c.date);

    const set = new Set(doneDates);

    const streakDates: string[] = [];
    const d = new Date(); // start from today

    while (true) {
      const key = formatDate(d);

      if (set.has(key)) {
        streakDates.push(key);
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return new Set(streakDates);
  };

  const streakSet = getStreakDates();

  const realToday = new Date();

  return (
    <div className="flex flex-col gap-3  w-full px-9 py-2">

      {/* Month Nav */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={prevMonth}><ChevronLeft /></Button>
        <p className="text-sm font-medium">{monthLabel}</p>
        <Button variant="secondary" onClick={nextMonth}><ChevronRight /></Button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-xs text-muted-foreground">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;

          const key = formatDate(date);
          const completed = map.get(key);
          const isToday =
            date.getDate() === realToday.getDate() &&
            month === realToday.getMonth() &&
            year === realToday.getFullYear();

          const isStreak = streakSet.has(key);
          const isFuture = formatDate(date) > formatDate(new Date());

          return (
            <Button variant={"calendar"}
              key={i}
              className={cn(`
                h-8 w-8  flex items-center justify-center rounded-md text-sm cursor-pointer`,
                isFuture && "opacity-30 cursor-not-allowed",
                isToday && "border dark:border-white border-black",
                completed === true 
                ? "bg-pink-500 dark:text-black text-white"
                : "dark:hover:bg-white/10 hover:bg-black/5",
                isStreak && "bg-orange-500",
                currentDate.getDate() === date.getDate() && "dark:bg-white dark:text-black bg-black text-white",
              )}
              onClick={() => setCurrentDate(date)}
              disabled={isFuture}
            >
              {date.getDate()}
            </Button>
          );
        })}
      </div>

    </div>
  );
};

