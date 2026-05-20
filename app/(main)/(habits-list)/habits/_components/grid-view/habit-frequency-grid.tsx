"use client";

import { Habit, Completion, HabitStatus } from "@/lib/types";

import { DailyHabitGrid } from "./daily-habit-grid";
import { MonthlyHabitGrid } from "./monthly-habit-grid";
import { WeeklyHabitGrid } from "./weekly-habit-grid";
import { YearlyHabitGrid } from "./yearly-habit-grid";

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

  if (habit.frequency === "month") {
    return (
      <MonthlyHabitGrid
        habit={habit}
        completions={completions}
        statusMap={statusMap}
      />
    );
  }

  if (habit.frequency === "year") {
    return (
      <YearlyHabitGrid
        habit={habit}
        completions={completions}
        statusMap={statusMap}
      />
    );
  }

  return null;
};
