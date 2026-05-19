import { Completion, Habit, HABIT_STATUS } from "@/lib/types";
import { formatDate } from "@/lib/date";

type PeriodRange = {
  start: string;
  end: string;
};

export const getPeriodDates = (
  frequency: Habit["frequency"],
  targetDate: string
): PeriodRange => {
  const date = new Date(`${targetDate}T00:00:00`);

  // DAY
  if (frequency === "day") {
    return {
      start: targetDate,
      end: targetDate,
    };
  }

  // WEEK (Sun -> Sat)
  if (frequency === "week") {
    const day = date.getDay();

    const start = new Date(date);
    start.setDate(date.getDate() - day);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  }

  // MONTH
  if (frequency === "month") {
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );

    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );

    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  }

  // YEAR
  const start = new Date(
    date.getFullYear(),
    0,
    1
  );

  const end = new Date(
    date.getFullYear(),
    11,
    31
  );

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

type HabitProgress = {
  current: number;
  target: number;
  completed: boolean;
  percentage: number;
};

export const calculateHabitProgress = (
  habit: Habit,
  completions: Completion[],
  targetDate: string
): HabitProgress => {

  const { start, end } = getPeriodDates(
    habit.frequency,
    targetDate
  );

  const effectiveStart = start < habit.startDate ? habit.startDate : start;

  const filtered = completions.filter((completion) => {
    return (
      completion.habitId === habit.id &&
      completion.date >= effectiveStart &&
      completion.date <= end 
      // completion.date >= habit.startDate
    );
  });

  let current = 0;

  for (const completion of filtered) {

    // NEW measurable logs
    if (completion.value !== null) {
      current += Number(completion.value);
      continue;
    }

    // OLD toggle-based completed habits
    if (completion.status === HABIT_STATUS.COMPLETED) {
      current += 1;
    }
  }

  const target = habit.targetValue;

  const completed = current >= target;

  const percentage =
    target === 0
      ? 0
      : Math.min(
          100,
          Math.round((current / target) * 100)
        );

  return {
    current,
    target,
    completed,
    percentage,
  };
};

export const isHabitCompletedForDate = (
  habit: Habit,
  completions: Completion[],
  targetDate: string
) => {
  const hasManualBreak = completions.some((completion) => {
    return (
      completion.habitId === habit.id &&
      completion.date === targetDate &&
      completion.value === null &&
      (
        completion.status === HABIT_STATUS.SKIPPED ||
        completion.status === HABIT_STATUS.FAILED
      )
    );
  });

  if (hasManualBreak) {
    return false;
  }

  return calculateHabitProgress(
    habit,
    completions,
    targetDate
  ).completed;
};
