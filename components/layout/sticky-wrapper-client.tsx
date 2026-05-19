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
    </div>
  );
};