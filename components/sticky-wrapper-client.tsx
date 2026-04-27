"use client";

import { useViewStore } from "@/store/use-view-store";
import { useHabitStore } from "@/store/use-habit-store";

import { DailyNote } from "./daily-note";
import { HabitCalendar } from "./habit-calender";
import { Heatmap } from "./heatmap";
import { HabitStats } from "./habit-stats";
import { HabitHeader } from "./habit-header";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const StickyWrapperClient = () => {
  const { view } = useViewStore();
  const {
    selectedHabit,
    nextHabit,
    prevHabit
  } = useHabitStore();

  return (
    <div className="flex flex-col">
      <HabitHeader />
      <Separator className="my-3"/>

      {view === "heatmap" && (
        <>
          <Heatmap />
          <DailyNote />
        </>
      )}

      {view === "habit" && !selectedHabit && (
        <div className="flex items-center justify-center text-muted-foreground">
          Click on a Habit to see Stats & Streaks
        </div>
      )}

      {view === "habit" && selectedHabit && (
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full px-9">

              <Button variant="ghost" onClick={prevHabit}>
                <ChevronLeft size={18} />
              </Button>

              <span className="font-semibold text-xl text-pink-500 px-3 py-1 border-b dark:border-b-white/60 border-b-black/60">
                {selectedHabit.name}
              </span>

              <Button variant="ghost" onClick={nextHabit}>
                <ChevronRight size={18} />
              </Button>

            </div>

            <HabitCalendar habit={selectedHabit} />
          </div>

          <Separator />
          <HabitStats />
        </div>
      )}
    </div>
  );
};