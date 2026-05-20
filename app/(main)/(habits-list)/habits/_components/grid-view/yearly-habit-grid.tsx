"use client";

import { Completion, Habit, HabitStatus } from "@/lib/types";

import { WeeklyHabitGrid } from "./weekly-habit-grid";

type Props = {
  habit: Habit;
  completions: Completion[];
  statusMap: Map<string, HabitStatus>;
};

export const YearlyHabitGrid = (props: Props) => {
  return <WeeklyHabitGrid {...props} />;
};
