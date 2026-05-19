"use client";

import { getLast14Days } from "@/lib/helper";
import { getToday } from "@/lib/date";

import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/use-date-store";

import { Flame, TextAlignEnd } from "lucide-react";

import { Button } from "@/components/ui/button";

export const HabitGridHeader = () => {
  const days = getLast14Days();

  const { currentDate, setCurrentDate } =
    useDateStore();

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
      <div className="w-px bg-black/10 dark:bg-white/10" />

      {/* RIGHT */}
      <div className="flex flex-1 min-w-0">

        {/* GRID */}
        <div className="flex flex-1 justify-end overflow-hidden ">
          <div
          className="grid w-full"
            style={{
              minWidth: `${days.length * 48}px`,
              gridTemplateColumns: `repeat(${days.length}, minmax(48px, 1fr))`,
            }}
          >

            {days.map((day) => {
              const date = new Date(
                day.date + "T00:00:00"
              );

              const isToday =
                getToday() === day.date;

              const isSelected =
                date.getDate() ===
                currentDate.getDate();

              return (
                <div
                  key={day.date}
                  onClick={() =>
                    setCurrentDate(date)
                  }
                  className={cn(
                    "h-full w-full flex flex-col items-center justify-center border- border-black/10 dark:border-white/10 cursor-default transition-colors",
                    isSelected &&
                      "dark:bg-white/10 bg-black/10"
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-medium text-muted-foreground",
                      isToday &&
                        "text-emerald-500"
                    )}
                  >
                    {day.shortDay}
                  </p>

                  <p
                    className={cn(
                      "text-xs mt-1",
                      isToday &&
                        "text-emerald-500 font-semibold"
                    )}
                  >
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* STREAK */}
        <div className="w-14 shrink-0 flex items-center justify-center border-l border-black/10 dark:border-white/10">
          <Flame
            size={18}
            fill="orange"
            stroke="orange"
          />
        </div>
      </div>
    </div>
  );
};