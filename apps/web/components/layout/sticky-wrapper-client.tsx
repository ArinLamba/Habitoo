"use client";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { CircularProgress } from "@/app/(main)/(habits-list)/habits/_components/circular-progress";
import { Heatmap } from "../heatmap";
import { DailyNote } from "../daily-note";


export const StickyWrapperClient = () => {

  const { data: habits = [] } = useHabits();
  const { data: completions = [] } = useCompletions(90);
  
  return (
    <div className="flex flex-col gap-3">
      <CircularProgress habits={habits} completions={completions}/>
      <section className="rounded-md border border-black/10 bg-zinc-50/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
        <Heatmap habits={habits} completions={completions} days={90}/>
      </section>
      <section className="rounded-md border border-black/10 bg-zinc-50/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
        <DailyNote />
      </section>
    </div>
  );
};
