import { Completion, Habit } from "./types";

const getWeeklyPerformance = (completions: Completion[]) => {
  const days = Array(7).fill(0);        // completed
  const totals = Array(7).fill(0);      // total entries

  completions.forEach(c => {
    const day = new Date(c.date + "T00:00:00").getDay();
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

export const getLongestBreak = (dates: string[]) => {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();

  let longest = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);

    const diff =
      (curr.getTime() - prev.getTime()) /
      (1000 * 60 * 60 * 24) - 1;

    longest = Math.max(longest, diff);
  }

  return longest;
};

export const getMostActiveDay = (completions: Completion[]) => {
  const count = new Map();

  completions.forEach((c) => {
    if (!c.completed) return;

    const day = new Date(c.date + "T00:00:00").toLocaleString("default", {
      weekday: "long",
    });

    count.set(day, (count.get(day) || 0) + 1);
  });

  return [...count.entries()].sort((a, b) => b[1] - a[1])[0];
};
