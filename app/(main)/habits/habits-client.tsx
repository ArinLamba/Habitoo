"use client";
import { useMemo } from "react";

import { HabitList } from "./_components/habit-list";
import { HabitMarking } from "./habit-marking";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useDateStore } from "@/store/use-date-store";
import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";

import { HabitStackView } from "./_components/habit-stack-view";
import { cn } from "@/lib/utils";
import { HABIT_STATUS } from "@/lib/types";
import { BottomActionBar } from "./_components/bottom-action-bar";

import { useStats } from "@/hooks/use-stats";


export const HabitsClient = () => {
  const { currentDate } = useDateStore();
  const { habitViewLayout } = usehabitViewLayoutStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 🔥 SINGLE SOURCE OF TRUTH FETCHING
  const { data: habits = [], isLoading: isHabitsLoading } = useHabits();
  const { data: completions = [], isLoading: isCompletionLoading} = useCompletions();
  const { completionMap } = useStats(habits, completions);
  
  const perfectDaysSet = useMemo(() => {
    const map = new Map<string, Set<string>>();

    // build date → completed habitIds
    completions.forEach((c) => {
      if (c.status !== HABIT_STATUS.COMPLETED) return;

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
  <div className="h-[calc(100vh-60px)] flex flex-col">
    <div
      className={cn(
        "flex-1 min-h-0 flex flex-col overflow-hidden rounded-0 border rounded-t-md  border-black/10 bg-white pl-3 pt-0 pb-0 pr-3 shadow-md dark:border-white/10 dark:bg-zinc-900"
      )}
    >
      {/* SCROLL AREA */}
       <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {habitViewLayout === "grid" ? (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full"
          >
            <ResizablePanel defaultSize={25}>
              <HabitList habits={habits} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={75}>
              {isHabitsLoading || isCompletionLoading ? (
                <Loading />
              ) : habits.length === 0 ? (
                <Empty />
              ) : (
                <HabitMarking
                  habits={habits}
                  completionMap={completionMap}
                  perfectDaysSet={perfectDaysSet}
                  month={month}
                  year={year}
                />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <HabitStackView
            habits={habits}
            completions={completions}
          />
        )}
      </div>

      {/* BOTTOM BAR */}
    </div>
      <BottomActionBar completionMap={completionMap} />
  </div>
)
};
