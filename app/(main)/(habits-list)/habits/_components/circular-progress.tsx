"use client";
import { useEffect, useMemo, useState } from "react";

import { formatDate, parseLocalDate } from "@/lib/date";
import { Completion, Habit } from "@/lib/types";
import { isHabitCompletedForDate } from "@/lib/habits/progress";

import { useDateStore } from "@/store/use-date-store";



type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const CircularProgress = ({ 
  habits, 
  completions
}: Props) => {


  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  const currentDate = useDateStore((s) => s.currentDate);
  
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const selectedDateStr = formatDate(currentDate);

  const activeHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.lifecycle !== "active") return false;
      if (!habit || !habit.startDate) return false;

      const created = normalize(parseLocalDate(habit.startDate));
      const current = normalize(currentDate);

      return created <= current;
    });
  }, [habits, currentDate]);

  const activeIds = useMemo(() => {
    return new Set(activeHabits.map(h => h.id));
  }, [activeHabits]);

  const completed = useMemo(() => {
    return activeHabits.filter((habit) =>
      activeIds.has(habit.id) &&
      isHabitCompletedForDate(
        habit,
        completions,
        selectedDateStr
      )
    ).length;
  }, [activeHabits, completions, selectedDateStr, activeIds]);

  const total = activeHabits.length;

  const percentage = useMemo(() => {
    return total
      ? Math.round((completed / total) * 100)
      : 0;
  }, [completed, total]);

  const radius =60;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;

  const circumference = 2 * Math.PI * normalizedRadius;

  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  const monthName = currentDate.toLocaleString("default", { month: "short" });

  const color = getColor(percentage);

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      setAnimatedPercent(percentage);
    }, 50);

    return () => clearTimeout(timeout);
  }, [percentage]);


  return (
    <section className="rounded-md border border-black/10 bg-zinc-50/80 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Daily progress
        </p>
        <p className="text-xs text-muted-foreground">
          {day} {monthName} {year}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-5">
        
        {/* Circle */}
        <div className="relative my-2 flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            <circle
              stroke={color}
              className={` transition-all duration-500`}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              transform={`rotate(270 ${radius} ${radius})`}
              style={{
                transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
              }}
            />
          </svg>

          <div 
            className="absolute text-2xl font-semibold transition-colors duration-500"
            style={{ color }}
          >
            {Math.round(animatedPercent)}%
          </div>
        </div>
        
        <div className="h-20 w-px bg-black/10 dark:bg-white/10" />

        {/* Right side text */}
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            Completed
          </span>

          <span className={`text-lg font-bold `} style={{ color }}>
            {completed} / {total}
          </span>

          <span className="text-xs text-muted-foreground">
            habits today
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.max(0, total - completed)} left
          </p>

          <p className="text-xs text-muted-foreground">
            {getMessage(percentage)}
          </p>
        </div>

      </div>
    </section>
  );
};

const getColor = (percentage: number) => {
  const hue = (percentage / 100) * 120; // 0 → 120
  return `hsl(${hue}, 80%, 55%)`;
};

const getMessage = (percentage: number) => {
  if (percentage === 100) return "All done";
  if (percentage > 70) return "Almost there";
  if (percentage > 30) return "Keep going";
  return "Let's get started";
};

const normalize = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
