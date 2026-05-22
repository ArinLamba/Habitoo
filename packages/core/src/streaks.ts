import { getNextDay, getPrevDay, getToday } from "./date";
import { HABIT_STATUS, type Completion, type Habit } from "./habits";

export const getStreaks = (completions: Completion[]) => {
  const doneDates = completions
    .filter((completion) => completion.status === HABIT_STATUS.COMPLETED)
    .map((completion) => completion.date);

  if (doneDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const set = new Set(doneDates);

  let streak = 0;
  let current = getToday();

  if (!set.has(current)) {
    current = getPrevDay(current);
  }

  while (set.has(current)) {
    streak++;
    current = getPrevDay(current);
  }

  const sorted = Array.from(new Set(doneDates)).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let best = 0;
  let temp = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === getNextDay(sorted[i - 1])) {
      temp++;
    } else {
      best = Math.max(best, temp);
      temp = 1;
    }
  }

  best = Math.max(best, temp);

  return {
    currentStreak: streak,
    bestStreak: best,
  };
};

export const getAllHabitStreaks = (
  habits: Habit[],
  completions: Completion[]
) => {
  return habits.map((habit) => ({
    habitId: habit.id,
    name: habit.name,
    ...getHabitStreaks(habit.id, completions),
  }));
};

export const getHabitStreaks = (
  habitId: string,
  completions: Completion[]
) => {
  const today = getToday();
  const statusMap = new Map<string, string>();

  for (const completion of completions) {
    if (completion.habitId === habitId) {
      statusMap.set(completion.date, completion.status);
    }
  }

  const isSuccess = (date: string) => {
    const status = statusMap.get(date);

    if (status === HABIT_STATUS.COMPLETED) return true;
    if (status === HABIT_STATUS.SKIPPED) return "skip";

    return false;
  };

  let currentStreak = 0;
  let current = today;

  const todayStatus = isSuccess(today);
  if (todayStatus !== true) {
    current = getPrevDay(today);
  }

  while (true) {
    const status = isSuccess(current);

    if (status === true) {
      currentStreak++;
      current = getPrevDay(current);
      continue;
    }

    if (status === "skip") {
      current = getPrevDay(current);
      continue;
    }

    break;
  }

  const allDates = Array.from(statusMap.keys())
    .filter((date) => new Date(date) <= new Date(today))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let bestStreak = 0;
  let temp = 0;

  for (let i = 0; i < allDates.length; i++) {
    const status = isSuccess(allDates[i]);

    if (status === true) {
      temp++;
    } else if (status === "skip") {
      continue;
    } else {
      bestStreak = Math.max(bestStreak, temp);
      temp = 0;
    }
  }

  bestStreak = Math.max(bestStreak, temp);

  return { currentStreak, bestStreak };
};
