"use client";
import { useViewStore } from "@/store/use-view-store";
import { DailyNote } from "./daily-note";
import { HabitCalendar } from "./habit-calender";
import { Heatmap } from "./heatmap";
import { useHabitStore } from "@/store/use-habit-store";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

import { HabitStats } from "./habit-stats";
import { Habit } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitHeader } from "./habit-header";

type Props = {
  habits: Habit[];
};

export const StickyWrapperClient = ({ habits }: Props) => {

  const { view } = useViewStore();
  const { selectedHabit, setSelectedHabit } = useHabitStore();

  const currentIndex = habits.findIndex(
    (h) => h.id === selectedHabit?.id
  );

  const prevHabit = () => {
    const newIndex = (currentIndex - 1 + habits.length) % habits.length;
    setSelectedHabit(habits[newIndex]);
  };

  const nextHabit = () => {
    const newIndex = (currentIndex + 1) % habits.length;
    setSelectedHabit(habits[newIndex]);
  };
  
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <HabitHeader />
      <Separator className="my-3"/>
      
      {view === "heatmap" && (
        <>
          <Heatmap />
          <DailyNote />
        </>
      )}

      {!selectedHabit && (
        <div className="flex items-center justify-center text-muted-foreground">
          Click on a Habit to see Stats & Streaks
        </div>
      )}

      {view === "habit" && selectedHabit && (
        <div className="flex flex-col">
          <div className="flex flex-col items-center ">
            <div className="flex items-center justify-between w-full px-9">

              {/* Left Arrow */}
              <Button 
                variant="ghost"
                onClick={prevHabit}
              >
                <ChevronLeft size={18} />
              </Button>

              {/* Habit Name */}
              <span className="font-semibold text-xl text-pink-500  px-3 py-1 border-b dark:border-b-white/60 border-b-black/60">
                {selectedHabit?.name}
              </span>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                onClick={nextHabit}
              >
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
