"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { Habit } from "@/lib/types";

import { markHabit } from "@/actions/mark-habit";

import { Button } from "@/components/ui/button";

import { useDateStore } from "@/store/use-date-store";
import { useCompletionsStore } from "@/store/use-completions-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";



type Props = {
  habit: Habit;
};

export const TickBox = ({
  habit,
}: Props) => {
  
  const {id, createdAt } = habit;

  const currentDate = useDateStore((s) => s.currentDate);

  const completions = useCompletionsStore((s) => s.completions);
  const toggleCompletion = useCompletionsStore((s) => s.toggleCompletion);

  const router = useRouter();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  

  const completionSet = useMemo(() =>  
    new Set(
      completions
      .filter(c => c.completed)
      .map(c => `${c.habitId}-${c.date}`)
    ),
    [completions]
  );
    

  const handleMarkHabit = async (id: string, date: string) => {
    toggleCompletion(id, date); // 🔥 instant UI

    try {
      await markHabit(id, date);
    } catch {
      toggleCompletion(id, date); // rollback
    }
  };

  const normalize = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const today = normalize(new Date());
  const created = normalize(new Date(createdAt!));

  
  return (
    <div key={id} className="grid grid-cols-[repeat(31,minmax(0,1fr))] gap-x-9 mb-2">
      {days.map((day) => {
        const dateObj = new Date(year, month, day);
        const normalizedDate = normalize(dateObj);

        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const isDone = completionSet.has(`${id}-${date}`);

        const isBeforeStart = normalizedDate < created;
        const isFuture = normalizedDate > today;

        const isDisabled = isBeforeStart || isFuture;

        const stateStyles = isBeforeStart
          ? `
            bg-pink-800/60
            border border-dashed border-gray-400/60 dark:border-zinc-600
            opacity-70
            cursor-not-allowed
            shadow-sm
          `
          : isFuture
          ? `
            bg-blue-900/30
            border border-dashed border-blue-300/60 dark:border-blue-700
            text-blue-500/70 dark:text-blue-400/70
            cursor-not-allowed
            shadow-sm scale-[0.97]
          `
          : isDone
          ? `
            bg-green-500/30 dark:bg-green-600/70
            hover:bg-green-500/40 dark:hover:bg-green-500/80
            shadow-sm
          `
          : `
            bg-gray-100 dark:bg-zinc-800
            hover:bg-gray-200 dark:hover:bg-zinc-700
          `;

        return (
          <Button
            size="mark"
            variant="mark"
            key={day}
            disabled={isDisabled}
            className={cn(
              stateStyles,
              "transition-all duration-200 rounded-md ease-out"
            )}
            onClick={() => {
              if (isDisabled) return;
              handleMarkHabit(id, date);
            }}
          >
            {isDone && (
              <Check className="dark:text-green-200 text-green-700 opacity-90" />
            )}
            {!isDisabled && !isDone && (
              <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            )}
            {isFuture && (
              <div className="w-1 h-1 rounded-full bg-blue-700/70 dark:bg-blue-400/70 mx-auto" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

