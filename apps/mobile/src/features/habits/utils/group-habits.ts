import type { Completion, Habit, HabitLifecycle } from "@habitoo/core";

import { getHabitDayStatus } from "./habit-day-status";

export type HabitMode = "active" | "archived" | "completed";

export type HabitGroupKey =
  | Habit["frequency"]
  | "done"
  | "skipped"
  | "failed"
  | HabitLifecycle;

export type HabitSectionKind = "frequency" | "success" | "skipped" | "failed" | "lifecycle";

export type HabitGroup = {
  key: HabitGroupKey;
  title: string;
  kind: HabitSectionKind;
  habits: Habit[];
};

const frequencyLabels: Record<Habit["frequency"], string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

export function getHabitModeTitle(mode: HabitMode) {
  if (mode === "archived") return "Archived";
  if (mode === "completed") return "End Habits";
  return "My Journal";
}

export function groupHabits(
  habits: Habit[],
  selectedDate: string,
  completions: Completion[] = [],
  mode: HabitMode
): HabitGroup[] {
  if (mode !== "active") {
    const filtered = habits.filter((habit) => habit.lifecycle === mode);

    return filtered.length
      ? [
          {
            key: mode,
            kind: "lifecycle",
            title: mode === "archived" ? "Archived" : "End Habits",
            habits: filtered,
          },
        ]
      : [];
  }

  const activeHabits = habits.filter((habit) => habit.lifecycle === "active");

  const skipped: Habit[] = [];
  const failed: Habit[] = [];
  const success: Habit[] = [];
  const pendingByFrequency: Record<Habit["frequency"], Habit[]> = {
    day: [],
    week: [],
    month: [],
    year: [],
  };

  for (const habit of activeHabits) {
    const dayStatus = getHabitDayStatus(habit, selectedDate, completions);

    if (dayStatus === "skipped") {
      skipped.push(habit);
      continue;
    }

    if (dayStatus === "failed") {
      failed.push(habit);
      continue;
    }

    if (dayStatus === "success") {
      success.push(habit);
      continue;
    }

    pendingByFrequency[habit.frequency].push(habit);
  }

  const groups: HabitGroup[] = [];

  (["day", "week", "month", "year"] as const).forEach((frequency) => {
    if (pendingByFrequency[frequency].length === 0) return;

    groups.push({
      key: frequency,
      kind: "frequency",
      title: frequencyLabels[frequency],
      habits: pendingByFrequency[frequency],
    });
  });

  if (skipped.length > 0) {
    groups.push({
      key: "skipped",
      kind: "skipped",
      title: "Skipped",
      habits: skipped,
    });
  }

  if (failed.length > 0) {
    groups.push({
      key: "failed",
      kind: "failed",
      title: "Failed",
      habits: failed,
    });
  }

  if (success.length > 0) {
    groups.push({
      key: "done",
      kind: "success",
      title: "Success",
      habits: success,
    });
  }

  return groups;
}
