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

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const HabitsClient = ({ habits, completions }: Props) => {

  const setCompletions = useCompletionsStore((s) => s.setCompletions);
  
  useEffect(() => {
    setCompletions(completions);
  }, [completions]);

  return (
    <div className="space-y-6">

      <AnalysisBoard
        habits={habits}
        completions={completions}
      />

      <ResizablePanelGroup orientation="horizontal" className=" shadow-md flex gap-2 dark:bg-zinc-900 bg-white border-black/10 dark:border-white/10 p-3 rounded-md borer dark:border ">
        {/* LEFT */}
        <ResizablePanel defaultSize={40}>
          <HabitList habits={habits} completions={completions} />
        </ResizablePanel>
        <ResizableHandle withHandle/>
        {/* RIGHT */}
        <ResizablePanel defaultSize={60}>
          <HabitMarking
            habits={habits}
            completions={completions}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};