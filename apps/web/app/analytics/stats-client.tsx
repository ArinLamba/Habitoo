"use client";

import { HabitInsights } from "./habit-insight";
import { HabitPerformance } from "./habit-performance";
import { MonthlyTrend } from "./monthly-trend";
import { SmartInsight } from "./smart-insight";
import { StatsOverview } from "./stats-overview";
import { useCompletions } from "@/hooks/queries/use-completions";
import { useHabits } from "@/hooks/queries/use-habits";

export const StatsClient = () => {
  const { data: habits = [] } = useHabits();
  const { data: completions = [] } = useCompletions(365);

  return (
    <div className="mx-auto flex flex-col gap-4 px-2 pb-5">
      <div className="rounded-md border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Analytics
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Your habit rhythm
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A quiet view of what you logged, where momentum is building, and which habits deserve attention.
        </p>
      </div>

      <StatsOverview habits={habits} completions={completions} />

      <MonthlyTrend habits={habits} completions={completions} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HabitInsights habits={habits} completions={completions} />
        <SmartInsight completions={completions} />
      </div>

      <HabitPerformance habits={habits} completions={completions} />
    </div>
  );
};
