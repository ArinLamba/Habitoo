import * as z from "zod";

import { habitCompletions, habits } from "@/db/schema";

export type Completion = typeof habitCompletions.$inferSelect;
export type Habit = typeof habits.$inferSelect;



export type HabitStats = {
  habitId: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
};

export type HabitStatus = "completed" | "skipped" | "failed" | null;

export const HABIT_STATUS = {
  COMPLETED: "completed",
  SKIPPED: "skipped",
  FAILED: "failed",
} as const;


export const formSchema = z.object({
  name: z.string().min(2, "Habit name is required."),
  description: z.string().max(100, "Keep it brief.").optional(),
  startDate: z.string().min(1, "Please select a start date."),
  targetValue: z.number().positive(),
  unit: z.string(),
  frequency: z.enum(["day","week","month","year",]),
  icon: z.string(),
  color: z.string()
})

export type HabitFormValues = z.infer<typeof formSchema>;