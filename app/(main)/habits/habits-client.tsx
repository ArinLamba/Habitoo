"use client";
import { useMemo } from "react";

import { AnalysisBoard } from "./_components/analysis-board";
import { HabitList } from "./_components/habit-list";
import { HabitMarking } from "./habit-marking";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useHabits } from "@/hooks/queries/use-habits";
import { useDateStore } from "@/store/use-date-store";
import { useCompletions } from "@/hooks/queries/use-completions";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";

export const HabitsClient = () => {
  const { currentDate } = useDateStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 🔥 SINGLE SOURCE OF TRUTH FETCHING
  const { data: habits = [], isLoading: isHabitsLoading } = useHabits();
  const { data: completions = [], isLoading: isCompletionLoading} = useCompletions();

  const perfectDaysSet = useMemo(() => {
    const map = new Map<string, Set<string>>();

    // build date → completed habitIds
    completions.forEach((c) => {
      if (!c.completed) return;

      if (!map.has(c.date)) {
        map.set(c.date, new Set());
      }

      map.get(c.date)!.add(c.habitId);
    });

    const result = new Set<string>();

    map.forEach((completedSet, date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);

      const activeHabits = habits.filter((h) => {
        if (!h.createdAt) return false;

        const created = new Date(h.createdAt);
        created.setHours(0, 0, 0, 0);

        return created <= d;
      });

      if (activeHabits.length === 0) return;

      const allDone = activeHabits.every((h) =>
        completedSet.has(h.id)
      );

      if (allDone) {
        result.add(date);
      }
    });

    return result;
  }, [completions, habits]);

  

  return (
    <div className="space-y-6">
      <AnalysisBoard 
        habits={habits} 
        completions={completions}
      />

      <ResizablePanelGroup
        orientation="horizontal"
        className="shadow-md flex gap-2 dark:bg-zinc-900 bg-white border-black/10 dark:border-white/10 p-3 rounded-md"
      >
        <ResizablePanel defaultSize={40}>
          {/* 👇 PASS DATA DOWN */}
          <HabitList
            habits={habits}
            completions={completions}
            year={year}
            month={month}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          {isHabitsLoading || isCompletionLoading ? (
            <Loading />
          ) : habits.length === 0 ? (
            <Empty />
          ) : (
            <HabitMarking
              habits={habits}
              completions={completions}
              year={year}
              month={month}
              perfectDaysSet={perfectDaysSet}
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};