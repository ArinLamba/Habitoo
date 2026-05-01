"use client";
import { useEffect, useMemo, useState } from "react";

import { formatDate } from "@/lib/date";
import { Completion, Habit } from "@/lib/types";

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
      if (!habit || !habit.createdAt) return false;

      const created = normalize(new Date(habit.createdAt));
      const current = normalize(currentDate);

      return created <= current;
    });
  }, [habits, currentDate]);

  const activeIds = useMemo(() => {
    return new Set(activeHabits.map(h => h.id));
  }, [activeHabits]);

  const completed = useMemo(() => {
    return completions.filter(c =>
      c.completed &&
      c.date === selectedDateStr &&
      activeIds.has(c.habitId)
    ).length;
  }, [completions, selectedDateStr, activeIds]);

  const total = activeHabits.length;

  const percentage = useMemo(() => {
    return total
      ? Math.round((completed / total) * 100)
      : 0;
  }, [completed, total]);

  const radius = 78;
  const stroke = 8;
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
    <div className="flex flex-col px-6  ">
      <p className="text-sm text-muted-foreground  pl-2">Progress {day} {monthName} {year}</p>

      <div className="flex items-center gap-6 ">
        
        {/* Circle */}
        <div className="relative flex items-center justify-center w-40 h-40 mt-2">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="currentColor"
              className="dark:text-gray-700 text-gray-500"
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
        
        <div className="w-px h-20 bg-border" />

        {/* Right side text */}
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            Completed
          </span>

          <span className={`text-xl font-bold `} style={{ color }}>
            {completed} / {total}
          </span>

          <span className="text-xs text-muted-foreground">
            habits today
          </span>
          <p className="text-sm text-muted-foreground">
            {total - completed} left
          </p>

          <p className="text-xs text-muted-foreground">
            {getMessage(percentage)}
          </p>
        </div>

      </div>
    </div>
  );
};

const getColor = (percentage: number) => {
  const hue = (percentage / 100) * 120; // 0 → 120
  return `hsl(${hue}, 80%, 55%)`;
};

const getMessage = (percentage: number) => {
  if (percentage === 100) return "All done 🎉";
  if (percentage > 70) return "Almost there 🔥";
  if (percentage > 30) return "Keep going 💪";
  return "Let’s get started 🚀";
};

const normalize = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};