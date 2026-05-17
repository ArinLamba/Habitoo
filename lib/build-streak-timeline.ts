import { differenceInCalendarDays } from "date-fns";

import { Habit, Completion, HABIT_STATUS } from "./types";

export type StreakSegment = {
  start: string;
  end: string;

  length: number;

  isCurrent?: boolean;
  isBest?: boolean;
};

export type StreakTimelineData = {
  recent: StreakSegment[];
  top: StreakSegment[];

  total: number;
  hidden: number;
};

export const buildStreakTimeline = (
  habit: Habit,
  completions: Completion[]
): StreakTimelineData => {
  if (!habit?.startDate) {
    return {
      recent: [],
      top: [],
      total: 0,
      hidden: 0,
    };
  }

  const habitCompletions = completions
    .filter((c) => c.habitId === habit.id)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  if (!habitCompletions.length) {
    return {
      recent: [],
      top: [],
      total: 0,
      hidden: 0,
    };
  }

  const streaks: StreakSegment[] = [];

  let currentStart: string | null = null;
  let currentEnd: string | null = null;

  let currentLength = 0;

  let previousDate: Date | null = null;

  const pushCurrentStreak = () => {
    if (
      !currentStart ||
      !currentEnd ||
      currentLength <= 0
    ) {
      return;
    }

    streaks.push({
      start: currentStart,
      end: currentEnd,
      length: currentLength,
    });
  };

  for (const completion of habitCompletions) {
    const currentDate = new Date(completion.date);

    // ❌ FAILED → break streak
    if (completion.status === HABIT_STATUS.FAILED) {
      pushCurrentStreak();

      currentStart = null;
      currentEnd = null;
      currentLength = 0;
      previousDate = null;

      continue;
    }

    // 🔥 START FIRST STREAK
    if (!currentStart) {
      currentStart = completion.date;
      currentEnd = completion.date;

      currentLength =
        completion.status === HABIT_STATUS.COMPLETED
          ? 1
          : 0;

      previousDate = currentDate;

      continue;
    }

    const diff = differenceInCalendarDays(
      currentDate,
      previousDate!
    );

    // 📅 Missing day → new streak
    if (diff > 1) {
      pushCurrentStreak();

      currentStart = completion.date;
      currentEnd = completion.date;

      currentLength =
        completion.status === HABIT_STATUS.COMPLETED
          ? 1
          : 0;

      previousDate = currentDate;

      continue;
    }

    // 🔥 Continue streak
    currentEnd = completion.date;

    if (
      completion.status === HABIT_STATUS.COMPLETED
    ) {
      currentLength += 1;
    }

    previousDate = currentDate;
  }

  pushCurrentStreak();

  // =========================
  // 🏆 BEST STREAK
  // =========================

  const bestLength = Math.max(
    ...streaks.map((s) => s.length),
    0
  );

  streaks.forEach((s) => {
    if (s.length === bestLength) {
      s.isBest = true;
    }
  });

  // =========================
  // 🔥 CURRENT STREAK
  // =========================

  if (streaks.length > 0) {
    streaks[streaks.length - 1].isCurrent = true;
  }

  // =========================
  // 📅 RECENT STREAKS
  // =========================

  const recent = [...streaks]
    .sort(
      (a, b) =>
        new Date(b.end).getTime() -
        new Date(a.end).getTime()
    )
    .slice(0, 5);

  // =========================
  // 🏆 TOP STREAKS
  // =========================

  const recentKeys = new Set(
    recent.map((s) => `${s.start}-${s.end}`)
  );

  const top = [...streaks]
    .filter(
      (s) =>
        !recentKeys.has(`${s.start}-${s.end}`)
    )
    .sort((a, b) => b.length - a.length)
    .slice(0, 3);

  return {
    recent,
    top,

    total: streaks.length,

    hidden: Math.max(
      streaks.length - recent.length,
      0
    ),
  };
};