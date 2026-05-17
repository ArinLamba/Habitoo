import { formatDisplayDate, formatDate } from "@/lib/date";
import { getHabitStreaks } from "./streaks";
import { buildStreakTimeline } from "./build-streak-timeline";
import {
  ChartPoint,
  Completion,
  Habit,
  HABIT_STATUS,
  HabitStatus,
  
} from "./types";

export const buildHabitStats = (habit: Habit, completions: Completion[]) => {
  if (!habit) return null;

  const createdDate = new Date(habit.startDate!);
  if (isNaN(createdDate.getTime())) return null;

  createdDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDate(today);
  const startStr = formatDate(createdDate);

  const habitCompletions = completions.filter(
    (c) => c.habitId === habit.id
  );

  // =========================
  // 📅 CALENDAR
  // =========================
  const completionMap = new Map<string, HabitStatus>();

  const calendar = {
    completed: new Set<string>(),
    skipped: new Set<string>(),
    failed: new Set<string>(),
  };

  for (const c of habitCompletions) {
    completionMap.set(c.date, c.status);

    if (c.status === HABIT_STATUS.COMPLETED)
      calendar.completed.add(c.date);
    else if (c.status === HABIT_STATUS.SKIPPED)
      calendar.skipped.add(c.date);
    else if (c.status === HABIT_STATUS.FAILED)
      calendar.failed.add(c.date);
  }

  // =========================
  // 🔥 STREAKS
  // =========================
  const { currentStreak, bestStreak } = getHabitStreaks(
    habit.id,
    completions
  );

  const streakTimeline = buildStreakTimeline(
    habit,
    habitCompletions
  );

  // =========================
  // 📊 BASIC STATS
  // =========================
  const totalDays =
    Math.floor(
      (today.getTime() - createdDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const doneDays = new Set(
    habitCompletions
      .filter(
        (c) =>
          c.status === HABIT_STATUS.COMPLETED &&
          c.date >= startStr &&
          c.date <= todayStr
      )
      .map((c) => c.date)
  );

  const consistency = totalDays
    ? Math.round((doneDays.size / totalDays) * 100)
    : 0;

  const lastDone = [...habitCompletions]
    .filter(
      (c) =>
        c.status === HABIT_STATUS.COMPLETED &&
        c.date <= todayStr
    )
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const stats = {
    consistency,
    currentStreak,
    bestStreak,
    weekDone: doneDays.size,
    lastDoneText: lastDone
      ? formatDisplayDate(lastDone.date)
      : "Never",
    insight:
      consistency > 80
        ? "You're doing great 🔥"
        : consistency > 50
        ? "You're consistent, but can improve"
        : "Needs attention ⚠️",
    habitStartDate: startStr,
  };

  // =========================
  // 📈 CHART HELPERS
  // =========================


  // =========================
// 📈 CHART LAYER (REFAC)
// =========================

const toBool = (status?: HabitStatus) =>
  status === HABIT_STATUS.COMPLETED ? 1 : 0;

const getDates = (start: Date, end: Date) => {
  const arr: Date[] = [];
  const c = new Date(start);

  while (c <= end) {
    arr.push(new Date(c));
    c.setDate(c.getDate() + 1);
  }

  return arr;
};

const getCompletionPercent = (dates: Date[]) => {
  const completed = dates.reduce((acc, d) => {
    const key = formatDate(d);
    return acc + toBool(completionMap.get(key));
  }, 0);

  return Math.round((completed / dates.length) * 100);
};

// =========================
// 📅 DAILY (last 30 days)
// =========================
const dayChart: ChartPoint[] = (() => {
  const end = today;
  const start = new Date(today);
  start.setDate(today.getDate() - 29);

  const days = getDates(start, end);

  return days.map((d) => {
    const key = formatDate(d);
    const status = completionMap.get(key);

    return {
      label: d.getDate().toString(),
      value: toBool(status),
    };
  });
})();

// =========================
// 📆 WEEKLY (last ~8 weeks)
// =========================
const weekChart: ChartPoint[] = (() => {
  const end = today;
  const start = new Date(today);
  start.setDate(today.getDate() - 7 * 7);

  const days = getDates(start, end);

  const weeks: Date[][] = [];
  let bucket: Date[] = [];

  days.forEach((d) => {
    bucket.push(d);

    if (bucket.length === 7) {
      weeks.push(bucket);
      bucket = [];
    }
  });

  if (bucket.length) weeks.push(bucket);

  return weeks.map((w, i) => ({
    label: `W${i + 1}`,
    value: getCompletionPercent(w),
  }));
})();

// =========================
// 📆 MONTHLY (last 12 months)
// =========================
const monthChart: ChartPoint[] = (() => {
  const map = new Map<string, Date[]>();

  const days = getDates(new Date(habit.startDate), today);

  days.forEach((d) => {
    const monthKey = d.toISOString().slice(0, 7); // YYYY-MM

    if (!map.has(monthKey)) map.set(monthKey, []);
    map.get(monthKey)!.push(d);
  });

  return Array.from(map.entries()).map(([month, dates]) => ({
    label: month,
    value: getCompletionPercent(dates),
  }));
})();

// =========================
// 📊 YEARLY (if habit is long running)
// =========================
const yearChart: ChartPoint[] = (() => {
  const map = new Map<string, Date[]>();

  const days = getDates(new Date(habit.startDate), today);

  days.forEach((d) => {
    const yearKey = d.getFullYear().toString();

    if (!map.has(yearKey)) map.set(yearKey, []);
    map.get(yearKey)!.push(d);
  });

  return Array.from(map.entries()).map(([year, dates]) => ({
    label: year,
    value: getCompletionPercent(dates),
  }));
})();

// =========================
// FINAL
// =========================



  // =========================
  // FINAL RETURN
  // =========================
  return {
    stats,
    calendar: {
      completionMap,
      sets: calendar,
    },
    streaks: {
      currentStreak,
      bestStreak,
      timeline: streakTimeline,
    },
    charts: {
      day: dayChart,
      week: weekChart,
      month: monthChart,
      year: yearChart,
    }
  };
};