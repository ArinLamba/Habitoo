import { Completion, Habit } from "./types";
import { formatDate } from "./date";
import { getStreaks, getHabitStreaks } from "./streaks"; // 👈 your functions

export const buildStats = (
  habits: Habit[],
  completions: Completion[]
) => {
  const todayStr = formatDate(new Date());

  // 🔥 CORE STRUCTURES
  const doneSet = new Set<string>();
  const dayCount = new Map<string, number>();
  const weekdayCount = Array(7).fill(0);

  // ✅ SINGLE PASS
  completions.forEach((c) => {
    if (!c.completed || c.date > todayStr) return;

    // global
    doneSet.add(c.date);

    // heatmap
    dayCount.set(c.date, (dayCount.get(c.date) || 0) + 1);

    // weekday
    const day = new Date(c.date + "T00:00:00").getDay();
    weekdayCount[day]++;
  });

  // 🔥 ===== GLOBAL STREAK =====
  const { currentStreak, bestStreak } = getStreaks(completions);

  // 🔥 ===== PER HABIT STREAKS =====
  const habitStats = habits.map((habit) => {
    const { currentStreak, bestStreak } = getHabitStreaks(
      habit.id,
      completions
    );

    return {
      habitId: habit.id,
      name: habit.name,
      currentStreak,
      bestStreak,
    };
  });

  const habitStatsMap = new Map(
    habitStats.map((h) => [h.habitId, h])
  );

  // 🔥 ===== MOST ACTIVE DAY =====
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxDayIndex = weekdayCount.indexOf(Math.max(...weekdayCount));

  const mostActiveDay = {
    day: weekdayNames[maxDayIndex],
    count: weekdayCount[maxDayIndex],
  };

  // 🔥 ===== LONGEST BREAK =====
  const sortedDates = Array.from(doneSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let longestBreak = 0;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = sortedDates[i - 1];
    const curr = sortedDates[i];

    let gap = 0;
    const d = new Date(prev + "T00:00:00");

    d.setDate(d.getDate() + 1);

    while (formatDate(d) !== curr) {
      gap++;
      d.setDate(d.getDate() + 1);
    }

    longestBreak = Math.max(longestBreak, gap);
  }

  // 🔥 ===== CONSISTENCY =====
  const consistencySet = new Set(
    completions
      .filter((c) => c.completed && c.date <= todayStr)
      .map((c) => `${c.habitId}-${c.date}`)
  );

  let totalDays = 0;

  for (const habit of habits) {
    if (!habit?.createdAt) continue;

    const created = new Date(habit.createdAt);
    const today = new Date();

    const diff =
      Math.floor(
        (today.getTime() - created.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (diff > 0) totalDays += diff;
  }

  const consistency =
    totalDays > 0
      ? Math.min(
          100,
          Math.round((consistencySet.size / totalDays) * 100)
        )
      : 0;

  // 🔥 FINAL RETURN
  return {
    // raw
    doneSet,
    dayCount,

    // global
    currentStreak,
    bestStreak,
    consistency,

    // per habit
    habitStats,
    habitStatsMap,

    // insights
    mostActiveDay,
    longestBreak,
  };
};