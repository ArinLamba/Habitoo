"use client";

import { HabitInsights } from "./habit-insight";
import { StatsOverview } from "./stats-overview";
import { StreakSection } from "./streak-section";
import { WeeklyTrend } from "./weekly-trend";

import { HabitPerformance } from "./habit-performance";
import { SmartInsight } from "./smart-insight";
import { HabitStreakList } from "./habit-streaks";
import { useHabits } from "@/hooks/queries/use-habits";

import { useStats } from "@/hooks/use-stats";
import { useCompletions } from "@/hooks/queries/use-completions";


export const StatsClient = () => {

  const { data: habits = [] } = useHabits();
  const { data: completions = [] } = useCompletions();

  const stats = useStats(habits, completions);

  return (
    <div className="px-2 pb-5 flex flex-col gap-6  mx-auto">


      {/* 🟩 SECTION 1 — Overview */}
      <div className="flex flex-col gap-4">
        <StatsOverview habits={habits} completions={completions} />
        <StreakSection currentStreak={stats.currentStreak} bestStreak={stats.bestStreak}/>
      </div>

      {/* 🟦 SECTION 2 — Behavior */}
      <div className="flex flex-col gap-4">
        <WeeklyTrend completions={completions} />
      </div>

      {/* 🟪 SECTION 3 — Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HabitInsights habits={habits} completions={completions} />
        <SmartInsight completions={completions} />
      </div>

      {/* 🟧 SECTION 4 — Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HabitPerformance habits={habits} completions={completions} />
        <HabitStreakList habitStats={stats.habitStats} />
      </div>

    </div>
  );
};