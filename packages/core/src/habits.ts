import * as z from "zod";

export const habitFrequencies = ["day", "week", "month", "year"] as const;
export const habitLifecycles = ["active", "completed", "archived"] as const;

export type HabitFrequency = (typeof habitFrequencies)[number];
export type HabitLifecycle = (typeof habitLifecycles)[number];

export type HabitStatus = "completed" | "skipped" | "failed" | null;

export const HABIT_STATUS = {
  COMPLETED: "completed",
  SKIPPED: "skipped",
  FAILED: "failed",
} as const;

export const habitFormSchema = z.object({
  name: z.string().min(2, "Habit name is required."),
  description: z.string().max(100, "Keep it brief.").optional(),
  startDate: z.string().min(1, "Please select a start date."),
  targetValue: z.number().positive(),
  unit: z.string(),
  frequency: z.enum(habitFrequencies),
  icon: z.string(),
  color: z.string(),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

export type Habit = {
  id: string;
  userId?: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  lifecycle: HabitLifecycle;
  startDate: string;
  targetValue: number;
  currentValue?: number | null;
  unit?: string | null;
  frequency: HabitFrequency;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Completion = {
  id?: string;
  habitId: string;
  userId?: string;
  date: string;
  status: Exclude<HabitStatus, null>;
  value?: string | number | null;
  note?: string | null;
  completedAt?: Date | string;
};
