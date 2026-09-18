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
    <div className="sticky top-0 z-20 flex h-12 items-stretch border-b border-black/10 bg-zinc-50/95 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">

      {/* LEFT */}
      <div className="flex min-w-[250px] items-center justify-between pl-3 pr-1">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold tracking-tight">
            All Habits
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Select a day to inspect progress
          </p>
        </div>

        <Button variant="ghost" size="icon-sm">
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
                    "flex h-full w-full cursor-default flex-col items-center justify-center rounded-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5",
                    isSelected &&
                      "bg-blue-500/10 text-blue-700 dark:text-blue-300"
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-medium text-muted-foreground",
                      isToday &&
                        "text-blue-500"
                    )}
                  >
                    {day.shortDay}
                  </p>

                  <p
                    className={cn(
                      "text-xs mt-1",
                      isToday &&
                        "text-blue-500 font-semibold"
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
        <div className="flex w-14 shrink-0 items-center justify-center border-l border-black/10 dark:border-white/10">
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
