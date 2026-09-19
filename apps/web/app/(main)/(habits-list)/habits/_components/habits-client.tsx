"use client";

import { usehabitViewLayoutStore } from "@/store/use-habit-layout-store";

import { useHabits } from "@/hooks/queries/use-habits";
import { useCompletions } from "@/hooks/queries/use-completions";

import { HabitStackView } from "./list-view/habit-stack-view";
import { cn } from "@/lib/utils";
import { BottomActionBar } from "./bottom-action-bar";

import { useStats } from "@/hooks/use-stats";

import { HabitGridView } from "./grid-view/habit-grid-view";
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
    <div className="flex h-[calc(100vh-45px)] flex-col gap-2">
      <div className={cn(
          "flex flex-1 flex-col overflow-x-hidden rounded-md bg-white/95 shadow-sm backdrop-blur scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded scrollbar-thumb-zinc-300 dark:border-white/10 dark:bg-zinc-950/80 dark:scrollbar-thumb-zinc-700",
          habitViewLayout === "grid" && "border border-black/10 dark:border-white/10"
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
      {habitViewLayout === "grid" && (
        <BottomActionBar statusMap={statusMap} />
      )}
      
    </div>
  )
};
