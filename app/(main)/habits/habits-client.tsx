"use client";
import { useMemo } from "react";

import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { HabitStackView } from "./_components/list-view/habit-stack-view";
import { cn } from "@/lib/utils";
import { HABIT_STATUS } from "@/lib/types";
import { BottomActionBar } from "./_components/bottom-action-bar";

import { useStats } from "@/hooks/use-stats";

import { HabitGridView } from "./_components/grid-view/habit-grid-view";
import { EmptyState } from "@/components/empty";
import { Loading } from "@/components/loading";


export const HabitsClient = () => {
  const { habitViewLayout } = usehabitViewLayoutStore();


  // 🔥 SINGLE SOURCE OF TRUTH FETCHING
  const { data: habits = [], isLoading: isHabitsLoading } = useHabits();
  const { data: completions = [], isLoading: isCompletionLoading} = useCompletions();
  const { statusMap, habitStatsMap } = useStats(habits, completions);
  const habitsLength = habits.length;
  const isLoading = isHabitsLoading || isCompletionLoading;
  // const perfectDaysSet = useMemo(() => {
  //   const map = new Map<string, Set<string>>();

  //   // build date → completed habitIds
  //   completions.forEach((c) => {
  //     if (c.status !== HABIT_STATUS.COMPLETED) return;

  //     if (!map.has(c.date)) {
  //       map.set(c.date, new Set());
  //     }

  //     map.get(c.date)!.add(c.habitId);
  //   });

  //   const result = new Set<string>();

  //   map.forEach((completedSet, date) => {
  //     const d = new Date(date);
  //     d.setHours(0, 0, 0, 0);

  //     const activeHabits = habits.filter((h) => {
  //       if (!h.createdAt) return false;

  //       const created = new Date(h.createdAt);
  //       created.setHours(0, 0, 0, 0);

  //       return created <= d;
  //     });

  //     if (activeHabits.length === 0) return;

  //     const allDone = activeHabits.every((h) =>
  //       completedSet.has(h.id)
  //     );

  //     if (allDone) {
  //       result.add(date);
  //     }
  //   });

  //   return result;
  // }, [completions, habits]);
  
  return (
    <div className="h-[calc(100vh-65px)] flex flex-col">
      <div className={cn(
          "flex-1 flex flex-col overflow-x-hidden scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded scrollbar-thumb-zinc-700/50 rounded-0 border rounded-t-md  border-black/10 bg-white shadow-md dark:border-white/10 dark:bg-zinc-900/70"
        )}>
          {habitViewLayout === "grid" ? ( 
          <>
            {isLoading ? (
               <Loading /> 
            ) : habitsLength === 0 ? ( 
              <EmptyState />
            ) : (
              <HabitGridView 
                habits={habits} 
                statusMap={statusMap}
                habitStatsMap={habitStatsMap}
              /> 
            )}
          </>
          ) :
            <HabitStackView 
              habits={habits} 
              completions={completions}
            />
          }
        {/* BOTTOM BAR */}
      </div>
      <BottomActionBar statusMap={statusMap} />
    </div>
  )
};
