import { formatDate, normalize, parseLocalDate } from "./date";
import { HABIT_STATUS, type Completion, type Habit } from "./habits";

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};

export const getHeatmapData = (completions: Completion[]) => {
  const map = new Map<string, number>();

  completions.forEach((completion) => {
    if (completion.status !== HABIT_STATUS.COMPLETED) return;

    map.set(completion.date, (map.get(completion.date) || 0) + 1);
  });

  return map;
};

export const generateDays = (days = 90) => {
  const arr: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    arr.push(formatDate(d));
  }

  return arr;
};

export const generateHeatmapGrid = (days = 90) => {
  const result: string[][] = [];
  const today = new Date();

  let currentWeek: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const dateStr = formatDate(d);

    currentWeek.push(dateStr);

    if (d.getDay() === 6) {
      result.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length) result.push(currentWeek);

  return result;
};

export const getActiveHabits = (habits: Habit[], date: Date) => {
  const normalizedCurrent = normalize(date);

  return habits.filter((habit) => {
    if (habit.lifecycle !== "active") return false;
    if (!habit.startDate) return false;

    const created = normalize(parseLocalDate(habit.startDate));

    return created <= normalizedCurrent;
  });
};

export const last7Days = [...Array(7)].map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return d;
});

export const getLast14Days = () => {
  const days = [];

  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    days.push({
      date: formatDate(d),
      shortDay: d.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    });
  }

  return days;
};

export const buildCalendarDays = (startDate: string, months = 2) => {
  const start = parseLocalDate(startDate);
  const today = new Date();

  const days: Date[] = [];

  const end = new Date(today);
  end.setMonth(end.getMonth() + months);

  const cursor = new Date(start);
  cursor.setDate(1);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
};
