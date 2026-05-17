"use client";

import { getLast14Days } from "@/lib/helper";
import { getToday } from "@/lib/date";

import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/use-date-store";
import { Flame, TextAlignEnd } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HabitGridHeader = () => {
  const days = getLast14Days();
  const { currentDate, setCurrentDate } = useDateStore();

  return (
    <div className="flex items-stretch border-b border-black/10 dark:border-white/10 h-12">

      {/* LEFT */}
      <div className="min-w-[250px] flex items-center justify-between pl-3">
        <h2 className="text-sm font-semibold tracking-tight">
          All Habits
        </h2>

        <Button variant="ghost">
          <TextAlignEnd size={18} />
        </Button>
      </div>

      {/* DIVIDER */}
      <div className="w-0.5 bg-black/10 dark:bg-white/10" />

      {/* RIGHT */}
      <div className="flex  flex-row-reverse overflow-hidden min-w-0">

        {/* STREAK BLOCK (same structure as row) */}
        <div className="w-12 shrink-0 flex items-center justify-center bg-amer-900 border-l border-black/10 dark:border-white/10">
          <Flame size={18} fill="orange" stroke="orange" />
        </div>

        {/* DAYS */}
        <div className="flex flex-row-reverse min-w-0 overflow-hidden">
          {[...days].reverse().map((day) => {
            const date = new Date(day.date);

            const isToday = getToday() === day.date;
            const isSelected =
              date.getDate() === currentDate.getDate();

            const dayNumber = date.getDate();

            return (
              <div
                key={day.date}
                onClick={() => setCurrentDate(date)}
                className={cn(
                  "w-12 shrink-0 flex flex-col items-center justify-center cursor-default h-full transition-colors",
                  isSelected && "dark:bg-white/10 bg-black/10"
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-medium text-muted-foreground",
                    isToday && "text-emerald-500"
                  )}
                >
                  {day.shortDay}
                </p>

                <p
                  className={cn(
                    "text-xs mt-1",
                    isToday && "text-emerald-500 font-semibold"
                  )}
                >
                  {dayNumber}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};