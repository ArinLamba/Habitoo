"use client"
import { AnalysisBoard } from "./_analysis/analysis-board";
import { HabitList } from "./_list/habit-list";
import { HabitMarking } from "./habit-marking";
import { Completion, Habit } from "@/lib/types";
import { useCompletionsStore } from "@/store/use-completions-store";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { useHabitStore } from "@/store/use-habit-store";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const HabitsClient = ({ habits, completions }: Props) => {

  const setHabits = useHabitStore((s) => s.setHabits);
  const setCompletions = useCompletionsStore((s) => s.setCompletions);
  
  useEffect(() => {
    setHabits(habits);
    setCompletions(completions);
  }, [completions, habits]);


  return (
    <div className="space-y-6">

      <AnalysisBoard />

      <ResizablePanelGroup orientation="horizontal" className=" shadow-md flex gap-2 dark:bg-zinc-900 bg-white border-black/10 dark:border-white/10 p-3 rounded-md borer dark:border ">
        {/* LEFT */}
        <ResizablePanel defaultSize={40}>
          <HabitList  />
        </ResizablePanel>
        <ResizableHandle withHandle/>
        {/* RIGHT */}
        <ResizablePanel defaultSize={60}>
          <HabitMarking />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};