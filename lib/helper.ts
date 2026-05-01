import { formatDate } from "./date";
import { Completion } from "./types";


export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  // padding (start empty slots)
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // actual days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};



export const getHeatmapData = (completions: Completion[]) => {
  const map = new Map();

  completions.forEach((c) => {
    if (!c.completed) return;

    const date = c.date;

    map.set(date, (map.get(date) || 0) + 1);
  });

  return map;
};



export const generateDays = (days = 90) => {
  const arr = [];
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

    if (d.getDay() === 6) { // Saturday → end of week
      result.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length) result.push(currentWeek);

  return result;
};


