"use client";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { CircularProgress } from "@/app/(main)/habits/_components/circular-progress";
import { Separator } from "../ui/separator";

import { Heatmap } from "../heatmap";
import { DailyNote } from "../daily-note";


export const StickyWrapperClient = () => {

  const { data: habits = [] } = useHabits();
  const { data: completions = [] } = useCompletions();
  
  return (
    <div className="flex flex-col gap-2">
      <CircularProgress habits={habits} completions={completions}/>
      <Separator />
      <Heatmap habits={habits} completions={completions}/>
      <Separator />
      <DailyNote />
      {/* <HabitCalendar habit={habits[1]} completions={completions} /> */}
      {/* {view === "habit" && selectedHabit && (
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
      )} */}
    </div>
  );
};