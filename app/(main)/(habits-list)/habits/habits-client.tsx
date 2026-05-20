"use client";

import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { HabitStackView } from "./_components/list-view/habit-stack-view";
import { cn } from "@/lib/utils";
import { BottomActionBar } from "./_components/bottom-action-bar";

import { useStats } from "@/hooks/use-stats";

import { HabitGridView } from "./_components/grid-view/habit-grid-view";
import { EmptyState } from "@/components/empty";
import { Loading } from "@/components/loading";
import { useTodayRollover } from "@/hooks/use-today-rollover";

export const HabitsClient = () => {
  const { habitViewLayout } = usehabitViewLayoutStore();

  useTodayRollover();

  // 🔥 SINGLE SOURCE OF TRUTH FETCHING
  const { data: habits = [], isLoading: isHabitsLoading } = useHabits();
  const { data: completions = [], isLoading: isCompletionLoading} = useCompletions();
  const activeHabits = habits.filter(
    (habit) => habit.lifecycle === "active"
  );
  const { statusMap, habitStatsMap } = useStats(activeHabits, completions);
  const habitsLength = habits.length;
  const isLoading = isHabitsLoading || isCompletionLoading;
  
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col">
      <div className={cn(
          "flex-1 flex flex-col overflow-x-hidden scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded scrollbar-thumb-zinc-700/50 rounded-0 border rounded-t-md  border-black/15 bg-white shadow-md dark:border-white/15 dark:bg-zinc-900/70"
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
                completions={completions}
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
