"use client";

import { Habit, Completion, HabitStatus } from "@/lib/types";

import { DailyHabitGrid } from "./daily-habit-grid";
import { WeeklyHabitGrid } from "./weekly-habit-grid";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
};

export const HabitFrequencyGrid = ({
  habit,
  completions,
  statusMap,
}: Props) => {

  if (habit.frequency === "day") {
    return (
      <DailyHabitGrid
        habit={habit}
        completions={completions}
        statusMap={statusMap}
      />
    );
  }

  if (habit.frequency === "week") {
    return (
      <WeeklyHabitGrid
        habit={habit}
        completions={completions}
        statusMap={statusMap}
      />
    );
  }

  return (
    <div className="flex items-center px-4 text-sm text-muted-foreground">
      Coming Soon
    </div>
  );
};
