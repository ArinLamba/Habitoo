import { getNextDay, getPrevDay, getToday } from "./date";
import { Completion, Habit } from "./types";

export const getStreaks = (completions: Completion[]) => {
  const doneDates = completions
    .filter(c => c.completed)
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

  // ✅ get only completed dates for this habit (no future)
  const done = completions
    .filter(
      (c) =>
        c.habitId === habitId &&
        c.completed &&
        c.date <= today
    )
    .map((c) => c.date);

  if (done.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const set = new Set(done);

  // 🔥 CURRENT STREAK (clean logic)
  let currentStreak = 0;
  let current = getToday();

  // start from today OR yesterday
  if (!set.has(current)) {
    current = getPrevDay(current);
  }

  while (set.has(current)) {
    currentStreak++;
    current = getPrevDay(current);
  }

  // 🏆 BEST STREAK
  const sorted = Array.from(new Set(done)).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );


  let bestStreak = 0;
  let temp = 1;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === getNextDay(sorted[i - 1])) {
      temp++;
    } else {
      bestStreak = Math.max(bestStreak, temp);
      temp = 1;
    }
  }

  bestStreak = Math.max(bestStreak, temp);

  return { currentStreak, bestStreak };
};