import { Completion, Habit } from "./types";

const getNextDay = (dateStr: string) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return formatDate(d);
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
const isSameDay = (dateStr: string, completedAt: Date) => {
  const d1 = new Date(dateStr + "T00:00:00");
  const d2 = new Date(completedAt);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

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


export const getStreaks = (completions: Completion[]) => {
  
  const done = completions
    .filter(c => c.completed)
    .map(c => c.date);

  if (done.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const set = new Set(done);

  // 🔥 CURRENT STREAK (your logic)
  let streak = 0;
  const current = new Date();

  while (true) {
    const dateStr = formatDate(current);

    if (set.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      if (streak === 0) {
        current.setDate(current.getDate() - 1);
        const yesterday = formatDate(current);

        if (set.has(yesterday)) {
          streak++;
          current.setDate(current.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // 🔥 BEST STREAK (simple forward scan)
  const sorted = [...new Set(done)].sort();

  let best = 0;
  let temp = 0;
  let prev: string | null = null;

  sorted.forEach(d => {
    if (!prev) {
      temp = 1;
    } else {
      const next = getNextDay(prev);
      temp = d === next ? temp + 1 : 1;
    }

    best = Math.max(best, temp);
    prev = d;
  });

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

  const today = formatDate(new Date());

  const filtered = completions.filter(
    c => c.habitId === habitId && c.date <= today
  );
  const done = filtered
    .filter(c => c.habitId === habitId && c.completed)
    .map(c => c.date);

  if (done.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const set = new Set(done);

  // 🔥 CURRENT STREAK (backward walk)
  let currentStreak = 0;
  const current = new Date();

  while (true) {
    const dateStr = formatDate(current);

    if (set.has(dateStr)) {
      currentStreak++;
      current.setDate(current.getDate() - 1);
    } else {
      // allow yesterday grace
      if (currentStreak === 0) {
        current.setDate(current.getDate() - 1);
        const yesterday = formatDate(current);

        if (set.has(yesterday)) {
          currentStreak++;
          current.setDate(current.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // 🔥 BEST STREAK (forward scan)
  const sorted = [...new Set(done)].sort();

  let best = 0;
  let temp = 0;
  let prev: string | null = null;

  sorted.forEach(d => {
    if (!prev) {
      temp = 1;
    } else {
      const next = getNextDay(prev);
      temp = d === next ? temp + 1 : 1;
    }

    best = Math.max(best, temp);
    prev = d;
  });

  return { currentStreak, bestStreak: best };
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



export const getWeeklyPerformance = (completions: Completion[]) => {
  const days = Array(7).fill(0);        // completed
  const totals = Array(7).fill(0);      // total entries

  completions.forEach(c => {
    const day = new Date(c.date).getDay();
    totals[day]++;

    if (c.completed) days[day]++;
  });

  const percentages = days.map((done, i) =>
    totals[i] === 0 ? 0 : done / totals[i]
  );

  return percentages; // 0 → 1
};



export const getSmartInsight = (completions: Completion[]) => {
  const performance = getWeeklyPerformance(completions);

  const weekendAvg = (performance[0] + performance[6]) / 2;
  const weekdayAvg =
    (performance[1] +
      performance[2] +
      performance[3] +
      performance[4] +
      performance[5]) / 5;

  const midWeekAvg =
    (performance[2] + performance[3] + performance[4]) / 3;

  const overall =
    performance.reduce((a, b) => a + b, 0) / 7;

  const weekendLow = weekendAvg < weekdayAvg - 0.2;
  const midWeekStrong = midWeekAvg > weekdayAvg + 0.1;
  const lowOverall = overall < 0.5;

  // 🔥 Priority-based logic
  if (lowOverall) {
    return "Try focusing on consistency over perfection 💡";
  }

  if (weekendLow) {
    return "Weekends are breaking your streak ⚠️";
  }

  if (midWeekStrong) {
    return "You're strongest mid-week 💪";
  }

  // fallback
  return "You're maintaining a steady rhythm 👍";
};



export const getHabitPerformance = (
  habits: Habit[],
  completions: Completion[]
) => {
  return habits.map(habit => {
    const habitCompletions = completions.filter(
      c => c.habitId === habit.id
    );

    const total = habitCompletions.length;
    const done = habitCompletions.filter(c => c.completed).length;

    const percentage = total === 0 ? 0 : (done / total) * 100;

    return {
      name: habit.name,
      percentage: Math.round(percentage),
    };
  });
};

