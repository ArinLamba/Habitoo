"use client";

import { useViewStore } from "@/store/use-view-store";
import { useHabitStore } from "@/store/use-habit-store";

import { DailyNote } from "../daily-note";
import { HabitCalendar } from "../habits/habit-calender";
import { Heatmap } from "../heatmap";
import { HabitStats } from "../habits/habit-stats";
import { HabitHeader } from "../habits/habit-header";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";
import { usePathname } from "next/navigation";


export const StickyWrapperClient = () => {
  const pathname = usePathname();

  const { view } = useViewStore();

  const { data: habits = [] } = useHabits();
  const { data: completions } = useCompletions();

  const { selectedHabitId, setSelectedHabitId } = useHabitStore();


  const currentIndex = habits.findIndex(h => h.id === selectedHabitId);
  const selectedHabit = habits[currentIndex];
  
  const nextHabit = () => {
    if (currentIndex < habits.length - 1) {
      setSelectedHabitId(habits[currentIndex + 1].id);
    }
    if(currentIndex === habits.length - 1) {
      setSelectedHabitId(habits[0].id);
    }
  };

  const prevHabit = () => {
    if (currentIndex > 0) {
      setSelectedHabitId(habits[currentIndex - 1].id);
    }
    if(currentIndex === 0) {
      setSelectedHabitId(habits[habits.length - 1].id);
    }
  };
  return (
    <div className="flex flex-col">
      <HabitHeader />
      <Separator className="my-3"/>

      {view === "heatmap" && (
        <>
          <Heatmap 
            habits={habits ?? []}
            completions={completions ?? []}
          />
          {pathname !== "/stats" && <DailyNote /> }
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

            <HabitCalendar habit={selectedHabit} completions={completions ?? []}/>
          </div>

          <Separator />
          <HabitStats />
        </div>
      )}
    </div>
  );
};