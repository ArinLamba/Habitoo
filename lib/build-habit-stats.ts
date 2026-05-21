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

const parseDate = (date: string) => new Date(`${date}T00:00:00`);

const clampRange = (
  start: string,
  end: string,
  min: string,
  max: string
) => {
  const clampedStart = start < min ? min : start;
  const clampedEnd = end > max ? max : end;

  if (clampedStart > clampedEnd) return [];

  return getDates(parseDate(clampedStart), parseDate(clampedEnd));
};

const getPeriodKey = (
  frequency: Habit["frequency"],
  date: Date
) => {
  if (frequency === "day") return formatDate(date);
  if (frequency === "week") return getWeekKey(date);
  if (frequency === "month") return formatDate(date).slice(0, 7);

  return date.getFullYear().toString();
};

const getMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });

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

  const elapsedPeriodCount = new Set(
    getDates(createdDate, today).map((date) =>
      getPeriodKey(habit.frequency, date)
    )
  ).size;

  const donePeriods = new Set(
    [...calendar.completed]
      .filter((date) => date >= startStr && date <= todayStr)
      .map((date) => getPeriodKey(habit.frequency, parseDate(date)))
  );

  const consistency = elapsedPeriodCount
    ? Math.round((donePeriods.size / elapsedPeriodCount) * 100)
    : 0;

  const lastDone = [...calendar.completed]
    .filter((date) => date >= startStr && date <= todayStr)
    .sort()
    .at(-1);

  const stats = {
    consistency,
    currentStreak,
    bestStreak,
    completedCount: donePeriods.size,
    weekDone: donePeriods.size,
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
        return total + 1;
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
    if (!dates.length) return 0;

    if (habit.frequency === "day") {
      return habit.targetValue * dates.length;
    }

    const periods = new Set(
      dates.map((date) => getPeriodKey(habit.frequency, date))
    );

    return habit.targetValue * periods.size;
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
    return [...Array(8)].map((_, index) => {
      const anchor = new Date(today);
      anchor.setDate(today.getDate() - (7 - index) * 7);

      const weekStart = new Date(anchor);
      weekStart.setDate(anchor.getDate() - anchor.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const dates = clampRange(
        formatDate(weekStart),
        formatDate(weekEnd),
        startStr,
        todayStr
      );

      return {
        label: `W${getWeekKey(weekStart).split("-")[1]}`,
        value: getRangeValue(dates),
        target: getRangeTarget(dates),
      };
    });
  })();

  const monthChart = (() => {
    const months: { label: string; dates: Date[] }[] =
      [];
    const cursor = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      1
    );

    while (cursor <= today) {
      const start = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
      const dates = clampRange(
        formatDate(start),
        formatDate(end),
        startStr,
        todayStr
      );

      months.push({
        label: getMonthLabel(start),
        dates,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months.map(({ label, dates }) => ({
      label,
      value: getRangeValue(dates),
      target: getRangeTarget(dates),
    }));
  })();

  const yearChart = (() => {
    const years: { label: string; dates: Date[] }[] = [];

    for (
      let year = createdDate.getFullYear();
      year <= today.getFullYear();
      year++
    ) {
      const dates = clampRange(
        `${year}-01-01`,
        `${year}-12-31`,
        startStr,
        todayStr
      );

      years.push({
        label: year.toString(),
        dates,
      });
    }

    return years.map(({ label, dates }) => ({
      label,
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
