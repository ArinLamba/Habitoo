import {
  formatDisplayDate,
  formatDate,
} from "@/lib/date";
import {
  getHabitPeriodStreaks,
  isHabitCompletedForDate,
} from "./habits/progress";
import {
  Completion,
  Habit,
  HABIT_STATUS,
  HabitStatus,
} from "./types";

type CalendarSets = {
  completed: Set<string>;
  skipped: Set<string>;
  failed: Set<string>;
};

const getDates = (start: Date, end: Date) => {
  const arr: Date[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    arr.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return arr;
};

const getWeekKey = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDays =
    (date.getTime() - firstDay.getTime()) / 86400000;
  const weekNumber = Math.ceil(
    (pastDays + firstDay.getDay() + 1) / 7
  );

  return `${date.getFullYear()}-${weekNumber}`;
};

export const buildHabitStats = (
  habit: Habit,
  completions: Completion[]
) => {
  if (!habit) return null;

  const createdDate = new Date(`${habit.startDate}T00:00:00`);
  if (isNaN(createdDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = formatDate(today);
  const startStr = formatDate(createdDate);

  const habitCompletions = completions.filter(
    (completion) => completion.habitId === habit.id
  );

  const completionMap = new Map<string, HabitStatus>();

  const calendar: CalendarSets = {
    completed: new Set<string>(),
    skipped: new Set<string>(),
    failed: new Set<string>(),
  };

  for (const completion of habitCompletions) {
    if (completion.value !== null) continue;

    if (completion.status === HABIT_STATUS.SKIPPED) {
      completionMap.set(completion.date, completion.status);
      calendar.skipped.add(completion.date);
    }

    if (completion.status === HABIT_STATUS.FAILED) {
      completionMap.set(completion.date, completion.status);
      calendar.failed.add(completion.date);
    }
  }

  for (const date of getDates(createdDate, today)) {
    const dateStr = formatDate(date);

    if (
      calendar.skipped.has(dateStr) ||
      calendar.failed.has(dateStr)
    ) {
      continue;
    }

    if (
      isHabitCompletedForDate(
        habit,
        habitCompletions,
        dateStr
      )
    ) {
      completionMap.set(dateStr, HABIT_STATUS.COMPLETED);
      calendar.completed.add(dateStr);
    }
  }

  const {
    currentStreak,
    bestStreak,
    timeline: streakTimeline,
  } = getHabitPeriodStreaks(
    habit,
    habitCompletions,
    todayStr
  );

  const totalDays =
    Math.floor(
      (today.getTime() - createdDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const doneDays = new Set(
    [...calendar.completed].filter(
      (date) =>
        date >= startStr &&
        date <= todayStr
    )
  );

  const consistency = totalDays
    ? Math.round((doneDays.size / totalDays) * 100)
    : 0;

  const lastDone = [...doneDays].sort().at(-1);

  const stats = {
    consistency,
    currentStreak,
    bestStreak,
    weekDone: doneDays.size,
    lastDoneText: lastDone
      ? formatDisplayDate(lastDone)
      : "Never",
    insight:
      consistency > 80
        ? "You're doing great"
        : consistency > 50
        ? "You're consistent, but can improve"
        : "Needs attention",
    habitStartDate: startStr,
  };

  const getDateValue = (date: string) => {
    if (
      calendar.skipped.has(date) ||
      calendar.failed.has(date)
    ) {
      return 0;
    }

    return habitCompletions.reduce((total, completion) => {
      if (completion.date !== date) return total;

      if (completion.value !== null) {
        return total + Number(completion.value);
      }

      if (completion.status === HABIT_STATUS.COMPLETED) {
        return total + habit.targetValue;
      }

      return total;
    }, 0);
  };

  const getRangeValue = (dates: Date[]) => {
    return dates.reduce((total, date) => {
      return total + getDateValue(formatDate(date));
    }, 0);
  };

  const getRangeTarget = (dates: Date[]) => {
    if (!dates.length) return habit.targetValue;

    if (habit.frequency === "day") {
      return habit.targetValue * dates.length;
    }

    if (habit.frequency === "week") {
      const weeks = new Set(
        dates.map((date) => getWeekKey(date))
      );

      return habit.targetValue * weeks.size;
    }

    if (habit.frequency === "month") {
      const months = new Set(
        dates.map((date) => formatDate(date).slice(0, 7))
      );

      return habit.targetValue * months.size;
    }

    const years = new Set(
      dates.map((date) => date.getFullYear())
    );

    return habit.targetValue * years.size;
  };

  const dayChart = (() => {
    const end = today;
    const start = new Date(today);
    start.setDate(today.getDate() - 29);

    return getDates(start, end).map((date) => {
      const key = formatDate(date);
      const value = getDateValue(key);

      return {
        label: date.getDate().toString(),
        value,
        target: habit.targetValue,
      };
    });
  })();

  const weekChart = (() => {
    const end = today;
    const start = new Date(today);
    start.setDate(today.getDate() - 7 * 7);

    const weeks: Date[][] = [];
    let bucket: Date[] = [];

    getDates(start, end).forEach((date) => {
      bucket.push(date);

      if (bucket.length === 7) {
        weeks.push(bucket);
        bucket = [];
      }
    });

    if (bucket.length) weeks.push(bucket);

    return weeks.map((week, index) => ({
      label: `W${index + 1}`,
      value: getRangeValue(week),
      target: getRangeTarget(week),
    }));
  })();

  const monthChart = (() => {
    const map = new Map<string, Date[]>();

    getDates(createdDate, today).forEach((date) => {
      const monthKey = formatDate(date).slice(0, 7);

      if (!map.has(monthKey)) map.set(monthKey, []);
      map.get(monthKey)!.push(date);
    });

    return Array.from(map.entries()).map(([month, dates]) => ({
      label: month,
      value: getRangeValue(dates),
      target: getRangeTarget(dates),
    }));
  })();

  const yearChart = (() => {
    const map = new Map<string, Date[]>();

    getDates(createdDate, today).forEach((date) => {
      const yearKey = date.getFullYear().toString();

      if (!map.has(yearKey)) map.set(yearKey, []);
      map.get(yearKey)!.push(date);
    });

    return Array.from(map.entries()).map(([year, dates]) => ({
      label: year,
      value: getRangeValue(dates),
      target: getRangeTarget(dates),
    }));
  })();

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
    },
  };
};
