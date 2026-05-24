import { formatDate } from "../date";
import { HABIT_STATUS, type Completion, type Habit } from "../habits";

type PeriodRange = {
  start: string;
  end: string;
};

export const getPeriodDates = (
  frequency: Habit["frequency"],
  targetDate: string
): PeriodRange => {
  const date = new Date(`${targetDate}T00:00:00`);

  if (frequency === "day") {
    return {
      start: targetDate,
      end: targetDate,
    };
  }

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

  if (frequency === "month") {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
      start: formatDate(start),
      end: formatDate(end),
    };
  }

  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31);

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

type PeriodStreakSegment = {
  start: string;
  end: string;
  length: number;
  isCurrent?: boolean;
  isBest?: boolean;
};

export const calculateHabitProgress = (
  habit: Habit,
  completions: Completion[],
  targetDate: string
): HabitProgress => {
  const { start, end } = getPeriodDates(habit.frequency, targetDate);

  const effectiveStart = start < habit.startDate ? habit.startDate : start;

  const filtered = completions.filter((completion) => {
    return (
      completion.habitId === habit.id &&
      completion.date >= effectiveStart &&
      completion.date <= end
    );
  });

  let current = 0;

  for (const completion of filtered) {
    if (completion.value !== null) {
      current += Number(completion.value);
      continue;
    }

    if (completion.status === HABIT_STATUS.COMPLETED) {
      current += 1;
    }
  }

  const target = habit.targetValue;
  const completed = current >= target;

  const percentage =
    target === 0 ? 0 : Math.min(100, Math.round((current / target) * 100));

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
      (completion.status === HABIT_STATUS.SKIPPED ||
        completion.status === HABIT_STATUS.FAILED)
    );
  });

  if (hasManualBreak) {
    return false;
  }

  return calculateHabitProgress(habit, completions, targetDate).completed;
};

const getNextPeriodDate = (
  frequency: Habit["frequency"],
  dateStr: string
) => {
  const date = new Date(`${dateStr}T00:00:00`);

  if (frequency === "day") date.setDate(date.getDate() + 1);
  if (frequency === "week") date.setDate(date.getDate() + 7);
  if (frequency === "month") date.setMonth(date.getMonth() + 1);
  if (frequency === "year") date.setFullYear(date.getFullYear() + 1);

  return formatDate(date);
};

export const getHabitPeriodStreaks = (
  habit: Habit,
  completions: Completion[],
  todayStr = formatDate(new Date())
) => {
  const periods: {
    key: string;
    start: string;
    end: string;
    completed: boolean;
    skipped: boolean;
    failed: boolean;
  }[] = [];

  let cursor = getPeriodDates(habit.frequency, habit.startDate).start;
  const currentPeriodStart = getPeriodDates(habit.frequency, todayStr).start;

  while (cursor <= currentPeriodStart) {
    const range = getPeriodDates(habit.frequency, cursor);

    periods.push({
      key: range.start,
      start: range.start,
      end: range.end,
      completed: calculateHabitProgress(habit, completions, cursor).completed,
      skipped: completions.some(
        (completion) =>
          completion.habitId === habit.id &&
          completion.date >= range.start &&
          completion.date <= range.end &&
          completion.value === null &&
          completion.status === HABIT_STATUS.SKIPPED
      ),
      failed: completions.some(
        (completion) =>
          completion.habitId === habit.id &&
          completion.date >= range.start &&
          completion.date <= range.end &&
          completion.value === null &&
          completion.status === HABIT_STATUS.FAILED
      ),
    });

    cursor = getNextPeriodDate(habit.frequency, cursor);
  }

  let currentStreak = 0;
  let currentIndex = periods.length - 1;

  if (currentIndex >= 0 && !periods[currentIndex].completed) {
    if (!periods[currentIndex].failed) {
      currentIndex -= 1;
    }

    while (
      currentIndex >= 0 &&
      !periods[currentIndex].completed &&
      periods[currentIndex].skipped &&
      !periods[currentIndex].failed
    ) {
      currentIndex -= 1;
    }
  }

  while (currentIndex >= 0 && periods[currentIndex].completed) {
    currentStreak++;
    currentIndex--;

    while (
      currentIndex >= 0 &&
      !periods[currentIndex].completed &&
      periods[currentIndex].skipped &&
      !periods[currentIndex].failed
    ) {
      currentIndex--;
    }
  }

  let bestStreak = 0;
  let temp = 0;
  const segments: PeriodStreakSegment[] = [];
  let segmentStart: string | null = null;
  let segmentEnd: string | null = null;

  const pushSegment = () => {
    if (!segmentStart || !segmentEnd || temp <= 0) return;

    segments.push({
      start: segmentStart,
      end: segmentEnd,
      length: temp,
    });
  };

  for (const period of periods) {
    if (period.completed) {
      if (temp === 0) {
        segmentStart = period.start;
      }

      temp++;
      segmentEnd = period.end;
      bestStreak = Math.max(bestStreak, temp);
      continue;
    }

    if (period.skipped && !period.failed) {
      if (temp > 0) {
        segmentEnd = period.end;
      }

      continue;
    }

    pushSegment();
    temp = 0;
    segmentStart = null;
    segmentEnd = null;
  }

  pushSegment();

  const bestLength = Math.max(...segments.map((segment) => segment.length), 0);

  segments.forEach((segment, index) => {
    if (segment.length === bestLength && bestLength > 0) {
      segment.isBest = true;
    }

    if (index === segments.length - 1) {
      segment.isCurrent = true;
    }
  });

  const recent = [...segments]
    .sort((a, b) => b.end.localeCompare(a.end))
    .slice(0, 5);

  const recentKeys = new Set(
    recent.map((segment) => `${segment.start}-${segment.end}`)
  );

  const top = [...segments]
    .filter((segment) => !recentKeys.has(`${segment.start}-${segment.end}`))
    .sort((a, b) => b.length - a.length)
    .slice(0, 3);

  return {
    currentStreak,
    bestStreak,
    timeline: {
      recent,
      top,
      total: segments.length,
      hidden: Math.max(segments.length - recent.length, 0),
    },
  };
};
