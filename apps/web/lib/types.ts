import {
  HABIT_STATUS,
  HabitFormValues,
  habitFormSchema,
  HabitStatus,
} from "@habitoo/core";

import { habitCompletions, habits } from "@/db/schema";
import { buildHabitStats } from "./build-habit-stats";

export type Completion = typeof habitCompletions.$inferSelect;
export type Habit = typeof habits.$inferSelect;


export type HabitStats = ReturnType<typeof buildHabitStats>;

export { HABIT_STATUS, type HabitFormValues, type HabitStatus };

export const formSchema = habitFormSchema;

export type ChartPoint = {
  label: string;
  value: number; // 0–100 (% completion)
};

export type TrendPoint = {
  date: string;
  value: number; // rolling consistency
};
