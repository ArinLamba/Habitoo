"use client";

import { HabitItem } from "../_components/habit-item";
import { AddHabitInput } from "../_components/add-habit-input";
import { Completion, Habit } from "@/lib/types";
import { useStats } from "@/hooks/use-stats";

type Props = {
  habits: Habit[];
  completions: Completion[];
};

export const HabitList = ({
  habits,
  completions,
}: Props) => {

  const stats = useStats(habits, completions);
  
  return (
    <div className="flex flex-col gap-y-1 ">
      <div className="bg-blue-500/5 mr-3 mb-2.5 py-6.25 text-center rounded">
        <h3 className="text-blue-400 font-semibold tracking-wide ">Habits </h3>
      </div>

      <div className="flex no-scrollbar overflow-x-auto flex-col gap-y-1 border-r-white/30 mr-2">
        {habits
          .filter((h) => h && h.id) // 👈 prevents crash
          .map((habit) => {
            const currentHabit = stats.habitStatsMap.get(habit.id);
            return (
            <HabitItem
              key={habit.id}
              habit={habit}
              currentStreak={currentHabit?.currentStreak ?? 0}
            />
          )
        })}
      </div>
      <div className="flex items-center bg-aber-200 justify-center p-2 text-xs">
        <AddHabitInput />
      </div>
    </div>
  );
};