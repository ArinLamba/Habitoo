import { getNextDay, getPrevDay, getToday } from "./date";
import { Completion, Habit, HABIT_STATUS } from "./types";

export const getStreaks = (completions: Completion[]) => {
  const doneDates = completions
    .filter(c => c.status === HABIT_STATUS.COMPLETED)
    .map(c => c.date);

  if (doneDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const set = new Set(doneDates);

  // 🔥 CURRENT STREAK (clean version)
  let streak = 0;
  let current = getToday();

  // start from today OR yesterday
  if (!set.has(current)) {
    current = getPrevDay(current);
  }

  while (set.has(current)) {
    streak++;
    current = getPrevDay(current);
  }

  // 🏆 BEST STREAK
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
  return habits.map(habit => ({
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

  // Map date → status (important fix)
  const statusMap = new Map<string, string>();

  for (const c of completions) {
    if (c.habitId === habitId) {
      statusMap.set(c.date, c.status);
    }
  }

  const isSuccess = (date: string) => {
    const status = statusMap.get(date);

    if (status === HABIT_STATUS.COMPLETED) return true;
    if (status === HABIT_STATUS.SKIPPED) return "skip";

    return false; // FAILED / null / undefined
  };

  // -------------------------
  // 🔥 CURRENT STREAK
  // -------------------------
  let currentStreak = 0;
  let current = today;

  // if today not completed, try yesterday
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
      // skip does NOT break streak, just go back
      current = getPrevDay(current);
      continue;
    }

    // FAILED or no data → break
    break;
  }

  // -------------------------
  // 🏆 BEST STREAK
  // -------------------------
  const allDates = Array.from(statusMap.keys())
    .filter((d) => new Date(d) <= new Date(today))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let bestStreak = 0;
  let temp = 0;

  for (let i = 0; i < allDates.length; i++) {
    const status = isSuccess(allDates[i]);

    if (status === true) {
      temp++;
    } else if (status === "skip") {
      // skip doesn't break streak
      continue;
    } else {
      // break streak
      bestStreak = Math.max(bestStreak, temp);
      temp = 0;
    }
  }

  bestStreak = Math.max(bestStreak, temp);

  return { currentStreak, bestStreak };
};