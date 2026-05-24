import {
  calculateHabitProgress,
  HABIT_STATUS,
  type Completion,
  type Habit,
} from "@habitoo/core";

export type HabitDayStatus = "skipped" | "failed" | "success" | "pending";

const hasManualStatus = (completion: Completion) =>
  completion.value === null || completion.value === undefined;

export function getHabitDayStatus(
  habit: Habit,
  selectedDate: string,
  completions: Completion[]
): HabitDayStatus {
  if (selectedDate < habit.startDate) {
    return "pending";
  }

  const dayRows = completions.filter(
    (completion) =>
      completion.habitId === habit.id && completion.date === selectedDate
  );

  const manual = dayRows.find(hasManualStatus);

  if (manual?.status === HABIT_STATUS.SKIPPED) {
    return "skipped";
  }

  if (manual?.status === HABIT_STATUS.FAILED) {
    return "failed";
  }

  if (calculateHabitProgress(habit, completions, selectedDate).completed) {
    return "success";
  }

  return "pending";
}
